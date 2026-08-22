import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { boards } from "@/db/schema";

/**
 * Resolves a board's DB row id from its domain slug (the "financial" /
 * "fitness" identifier used in URLs and BoardConfig.id) plus the owning
 * user's id, or null if that user has no board for that domain.
 *
 * boards.id is a synthetic per-row id, decoupled from the domain slug, so
 * two different users can each have their own "financial" board without
 * colliding — every query that touches board-scoped data resolves through
 * this first.
 */
export async function resolveBoardId(domain: string, userId: string): Promise<number | null> {
  const [row] = await db
    .select({ id: boards.id })
    .from(boards)
    .where(and(eq(boards.domain, domain), eq(boards.userId, userId)));

  return row?.id ?? null;
}
