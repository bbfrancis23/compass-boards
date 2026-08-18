import { widgetRegistry } from "@/lib/widget-registry";
import { LineChartWidget, type LineChartWidgetConfig } from "@/lib/line-chart-widget";

widgetRegistry.register<LineChartWidgetConfig>({
  type: "progress-chart",
  kind: "output",
  label: "Progress",
  component: LineChartWidget,
  defaultSize: { w: 6, h: 4 },
  defaultConfig: {
    title: "Progress",
    dataKey: "date",
    series: [{ name: "calories", label: "Calories Burned" }],
  },
});
