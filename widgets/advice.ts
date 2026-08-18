import { widgetRegistry } from "@/lib/widget-registry";
import { AdviceWidget, type AdviceWidgetConfig } from "@/lib/advice-widget";

widgetRegistry.register<AdviceWidgetConfig>({
  type: "advice",
  kind: "output",
  label: "Advice",
  component: AdviceWidget,
  defaultSize: { w: 12, h: 4 },
});
