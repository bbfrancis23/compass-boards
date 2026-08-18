"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetData } from "@/db/schema";

export async function getWidgetData(widgetInstanceId: string): Promise<Record<string, unknown>[]> {
  const id = Number(widgetInstanceId);
  if (!Number.isInteger(id)) {
    throw new Error(`Invalid widget instance id: "${widgetInstanceId}"`);
  }

  const rows = await db
    .select()
    .from(widgetData)
    .where(eq(widgetData.widgetInstanceId, id))
    .orderBy(asc(widgetData.id));

  return rows.map((row) => row.data);
}
