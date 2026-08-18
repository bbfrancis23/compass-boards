import type { WidgetInstance } from "./widget-types";

export interface BoardWidgetData {
  type: string;
  rows: Record<string, unknown>[];
}

/** Per-widget data, keyed by widget instance id, as returned by `getWidgetData`. */
export type BoardData = Record<string, BoardWidgetData>;

/** All logged rows across the board for widget instances of a given type. */
export function findWidgetRows(data: BoardData, type: string): Record<string, unknown>[] {
  return Object.values(data)
    .filter((widget) => widget.type === type)
    .flatMap((widget) => widget.rows);
}

/** A board's identity, widget layout, and how it turns its data into an advice prompt. */
export interface BoardConfig {
  id: string;
  domain: string;
  label: string;
  widgets: WidgetInstance[];
  buildAdvicePrompt(data: BoardData): string;
}
