import { widgetRegistry } from "@/lib/widget-registry";
import { LineChartWidget, type LineChartWidgetConfig } from "@/lib/line-chart-widget";

widgetRegistry.register<LineChartWidgetConfig>({
  type: "spending-chart",
  kind: "output",
  label: "Spending",
  component: LineChartWidget,
  defaultSize: { w: 8, h: 3 },
  defaultConfig: {
    title: "Spending",
    dataKey: "date",
    series: [{ name: "amount", label: "Amount" }],
  },
});
