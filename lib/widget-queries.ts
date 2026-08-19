import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetInstances } from "@/db/schema";
import type { WidgetInstance } from "./widget-types";

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

export async function queryBoardWidgets(boardId: string): Promise<WidgetInstance[]> {
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

export async function applyWidgetLayout(boardId: string, updates: LayoutUpdate[]): Promise<void> {
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
