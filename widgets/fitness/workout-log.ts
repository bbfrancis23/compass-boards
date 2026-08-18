import { widgetRegistry } from "@/lib/widget-registry";
import { FormWidget, type FormWidgetConfig } from "@/lib/form-widget";

widgetRegistry.register<FormWidgetConfig>({
  type: "workout-log",
  kind: "input",
  label: "Workout Log",
  component: FormWidget,
  defaultSize: { w: 6, h: 4 },
  defaultConfig: {
    title: "Log Workout",
    submitLabel: "Add",
    fields: [
      { key: "type", label: "Type", type: "text", required: true },
      { key: "durationMin", label: "Duration (min)", type: "number", required: true },
      { key: "calories", label: "Calories", type: "number", required: true },
      { key: "distanceMi", label: "Distance (mi)", type: "number" },
      { key: "date", label: "Date", type: "date", required: true },
    ],
  },
});
