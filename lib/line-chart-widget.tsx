"use client";

import { LineChart } from "@mantine/charts";
import { Loader, Text } from "@mantine/core";
import { useWidgetData } from "./use-widget-data";
import type { WidgetComponentProps } from "./widget-types";

export interface LineChartSeriesConfig {
  name: string;
  color?: string;
  label?: string;
}

export interface LineChartWidgetConfig {
  /** Widget title shown in WidgetShell's title bar (falls back to the registry label). */
  title?: string;
  /** Key of each widget_data row to use for the x-axis. */
  dataKey: string;
  /** Which keys of each widget_data row to plot as lines. */
  series: LineChartSeriesConfig[];
}

/**
 * Generic, config-driven line chart. Reads its data from widget_data via
 * useWidgetData, so a board wires this up by registering a WidgetDefinition
 * whose component is LineChartWidget and whose instances set dataKey/series
 * — no bespoke chart component needed per domain.
 */
export function LineChartWidget({
  instance,
  boardId,
}: WidgetComponentProps<LineChartWidgetConfig>) {
  const { data, loading, error } = useWidgetData(boardId, instance.id);
  const config = instance.config;

  if (loading) return <Loader size="sm" />;
  if (error)
    return (
      <Text c="red" size="sm">
        {error}
      </Text>
    );
  if (!config) {
    return (
      <Text size="sm" c="dimmed">
        Widget is not configured.
      </Text>
    );
  }
  if (data.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        No data yet.
      </Text>
    );
  }

  return <LineChart h="100%" data={data} dataKey={config.dataKey} series={config.series} />;
}
