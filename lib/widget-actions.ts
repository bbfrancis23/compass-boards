"use server";

import { requireSession } from "./require-session";
import { applyWidgetLayout, queryBoardWidgets, type LayoutUpdate } from "./widget-queries";
import type { WidgetInstance } from "./widget-types";

export type { LayoutUpdate };

export async function getBoardWidgets(boardId: string): Promise<WidgetInstance[]> {
  const session = await requireSession();
  return queryBoardWidgets(boardId, session.user.id);
}

export async function updateWidgetLayout(boardId: string, updates: LayoutUpdate[]): Promise<void> {
  const session = await requireSession();
  await applyWidgetLayout(boardId, session.user.id, updates);
}
