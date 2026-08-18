import { widgetRegistry } from "@/lib/widget-registry";
import { LineChartWidget, type LineChartWidgetConfig } from "@/lib/line-chart-widget";

widgetRegistry.register<LineChartWidgetConfig>({
  type: "net-worth-chart",
  kind: "output",
  label: "Net Worth",
  component: LineChartWidget,
  defaultSize: { w: 8, h: 3 },
  defaultConfig: {
    title: "Net Worth",
    dataKey: "name",
    series: [{ name: "balance", label: "Balance" }],
  },
});
