import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetData, widgetInstances } from "@/db/schema";
import { resolveBoardId } from "./board-queries";

// Plain DB access, not "use server" — see widget-queries.ts for why these
// unguarded queries can't live in a "use server" file.

export async function queryWidgetData(
  domain: string,
  userId: string,
  widgetInstanceId: string,
): Promise<Record<string, unknown>[]> {
  const id = Number(widgetInstanceId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid widget instance id: "${widgetInstanceId}"`);
  }

  const boardId = await resolveBoardId(domain, userId);
  if (boardId === null) return [];

  const rows = await db
    .select({ data: widgetData.data })
    .from(widgetData)
    .innerJoin(widgetInstances, eq(widgetData.widgetInstanceId, widgetInstances.id))
    .where(and(eq(widgetData.widgetInstanceId, id), eq(widgetInstances.boardId, boardId)))
    .orderBy(asc(widgetData.id));

  return rows.map((row) => row.data);
}

export async function insertWidgetData(
  domain: string,
  userId: string,
  widgetInstanceId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const id = Number(widgetInstanceId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid widget instance id: "${widgetInstanceId}"`);
  }

  const boardId = await resolveBoardId(domain, userId);
  if (boardId === null) {
    throw new Error(`No "${domain}" board found for this user`);
  }

  const [instance] = await db
    .select({ id: widgetInstances.id })
    .from(widgetInstances)
    .where(and(eq(widgetInstances.id, id), eq(widgetInstances.boardId, boardId)));

  if (!instance) {
    throw new Error(`Widget instance "${widgetInstanceId}" not found on board "${domain}"`);
  }

  await db.insert(widgetData).values({ widgetInstanceId: id, data });
}
