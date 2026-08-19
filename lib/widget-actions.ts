"use server";

import { requireSession } from "./require-session";
import { applyWidgetLayout, queryBoardWidgets, type LayoutUpdate } from "./widget-queries";
import type { WidgetInstance } from "./widget-types";

export type { LayoutUpdate };

export async function getBoardWidgets(boardId: string): Promise<WidgetInstance[]> {
  await requireSession();
  return queryBoardWidgets(boardId);
}

export async function updateWidgetLayout(boardId: string, updates: LayoutUpdate[]): Promise<void> {
  await requireSession();
  await applyWidgetLayout(boardId, updates);
}
