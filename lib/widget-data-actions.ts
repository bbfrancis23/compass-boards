"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetData, widgetInstances } from "@/db/schema";

export async function getWidgetData(
  boardId: string,
  widgetInstanceId: string,
): Promise<Record<string, unknown>[]> {
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
