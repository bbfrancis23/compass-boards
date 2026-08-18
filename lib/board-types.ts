import type { WidgetInstance } from "./widget-types";

/** Per-widget data rows, keyed by widget instance id, as returned by `getWidgetData`. */
export type BoardData = Record<string, Record<string, unknown>[]>;

/** A board's identity, widget layout, and how it turns its data into an advice prompt. */
export interface BoardConfig {
  id: string;
  domain: string;
  label: string;
  widgets: WidgetInstance[];
  buildAdvicePrompt(data: BoardData): string;
}
