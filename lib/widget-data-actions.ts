"use server";

import { requireSession } from "./require-session";
import { insertWidgetData, queryWidgetData } from "./widget-data-queries";

export async function getWidgetData(
  boardId: string,
  widgetInstanceId: string,
): Promise<Record<string, unknown>[]> {
  const session = await requireSession();
  return queryWidgetData(boardId, session.user.id, widgetInstanceId);
}

export async function addWidgetData(
  boardId: string,
  widgetInstanceId: string,
  data: Record<string, unknown>,
): Promise<void> {
  const session = await requireSession();
  await insertWidgetData(boardId, session.user.id, widgetInstanceId, data);
}
