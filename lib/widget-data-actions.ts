"use server";

import { requireSession } from "./require-session";
import { insertWidgetData, queryWidgetData } from "./widget-data-queries";

export async function getWidgetData(
  boardId: string,
  widgetInstanceId: string,
): Promise<Record<string, unknown>[]> {
  await requireSession();
  return queryWidgetData(boardId, widgetInstanceId);
}

export async function addWidgetData(
  boardId: string,
  widgetInstanceId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await requireSession();
  await insertWidgetData(boardId, widgetInstanceId, data);
}
