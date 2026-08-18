import type { ComponentType } from "react";

/** Whether a widget collects data from the user or renders/derives it. */
export type WidgetKind = "input" | "output";

/** A widget placed on a board: its registry type, grid layout, and config. */
export interface WidgetInstance<TConfig = Record<string, unknown>> {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: TConfig;
}

/** Props every widget component receives when rendered on a board. */
export interface WidgetComponentProps<TConfig = Record<string, unknown>> {
  instance: WidgetInstance<TConfig>;
  boardId: string;
}

/** How a widget type registers itself with the widget registry. */
export interface WidgetDefinition<TConfig = Record<string, unknown>> {
  type: string;
  kind: WidgetKind;
  label: string;
  component: ComponentType<WidgetComponentProps<TConfig>>;
  defaultSize: { w: number; h: number };
  defaultConfig?: TConfig;
}
