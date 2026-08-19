"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetData, widgetInstances } from "@/db/schema";
import { requireSession } from "./require-session";

export async function getWidgetData(
  boardId: string,
  widgetInstanceId: string,
): Promise<Record<string, unknown>[]> {
  await requireSession();

  const id = Number(widgetInstanceId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid widget instance id: "${widgetInstanceId}"`);
  }

  const rows = await db
    .select({ data: widgetData.data })
    .from(widgetData)
    .innerJoin(widgetInstances, eq(widgetData.widgetInstanceId, widgetInstances.id))
    .where(and(eq(widgetData.widgetInstanceId, id), eq(widgetInstances.boardId, boardId)))
    .orderBy(asc(widgetData.id));

  return rows.map((row) => row.data);
}

export async function addWidgetData(
  boardId: string,
  widgetInstanceId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await requireSession();

  const id = Number(widgetInstanceId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid widget instance id: "${widgetInstanceId}"`);
  }

  const [instance] = await db
    .select({ id: widgetInstances.id })
    .from(widgetInstances)
    .where(and(eq(widgetInstances.id, id), eq(widgetInstances.boardId, boardId)));

  if (!instance) {
    throw new Error(`Widget instance "${widgetInstanceId}" not found on board "${boardId}"`);
  }

  await db.insert(widgetData).values({ widgetInstanceId: id, data });
}
