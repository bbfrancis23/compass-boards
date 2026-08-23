import "server-only";
import { LibsqlError } from "@libsql/client";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetInstances } from "@/db/schema";
import { resolveBoardId } from "./board-queries";
import { seedFinancialDemo, seedFitnessDemo } from "./demo-seed";
import type { WidgetInstance } from "./widget-types";

// Demo boards/widgets are otherwise only ever created by the db:seed CLI
// script — auto-provision one of these on a user's first visit to that
// domain instead of leaving them with a permanently empty board.
const DEMO_SEEDERS = {
  financial: seedFinancialDemo,
  fitness: seedFitnessDemo,
} satisfies Record<string, typeof seedFinancialDemo>;

export interface LayoutUpdate {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Plain DB access, not "use server" — every exported async function in a
// "use server" file becomes a remotely-callable Server Action, so these
// unguarded queries must live outside one. lib/widget-actions.ts wraps
// them with requireSession() for external (client) callers; other server
// code (e.g. lib/advice-actions.ts) that has already checked the session
// itself can call these directly, instead of paying for a repeated check
// per widget.

export async function queryBoardWidgets(domain: string, userId: string): Promise<WidgetInstance[]> {
  let boardId = await resolveBoardId(domain, userId);
  if (boardId === null) {
    const seedDemo = DEMO_SEEDERS[domain as keyof typeof DEMO_SEEDERS];
    if (!seedDemo) return [];
    try {
      await seedDemo(db, userId);
    } catch (err) {
      // Another concurrent request may have already seeded this user+domain
      // (boards has a unique index on (user_id, domain)) -- only treat a
      // genuine unique-constraint violation as that race and recheck;
      // anything else (a DB outage, a partial seeding failure, etc.) is a
      // real error and should propagate instead of silently returning an
      // empty/incomplete board.
      if (!(err instanceof LibsqlError) || err.code !== "SQLITE_CONSTRAINT") throw err;
      boardId = await resolveBoardId(domain, userId);
      if (boardId === null) throw err;
    }
    boardId ??= await resolveBoardId(domain, userId);
    if (boardId === null) return [];
  }

  const rows = await db
    .select({
      id: widgetInstances.id,
      type: widgetInstances.type,
      x: widgetInstances.x,
      y: widgetInstances.y,
      w: widgetInstances.w,
      h: widgetInstances.h,
      config: widgetInstances.config,
    })
    .from(widgetInstances)
    .where(eq(widgetInstances.boardId, boardId))
    .orderBy(asc(widgetInstances.id));

  return rows.map((row) => ({
    id: String(row.id),
    type: row.type,
    x: row.x,
    y: row.y,
    w: row.w,
    h: row.h,
    config: row.config ?? undefined,
  }));
}

export async function applyWidgetLayout(
  domain: string,
  userId: string,
  updates: LayoutUpdate[],
): Promise<void> {
  const boardId = await resolveBoardId(domain, userId);
  if (boardId === null) return;

  await Promise.all(
    updates.map((update) => {
      const id = Number(update.id);
      if (!Number.isInteger(id)) {
        throw new Error(`Invalid widget instance id: "${update.id}"`);
      }

      return db
        .update(widgetInstances)
        .set({ x: update.x, y: update.y, w: update.w, h: update.h })
        .where(and(eq(widgetInstances.id, id), eq(widgetInstances.boardId, boardId)));
    }),
  );
}
