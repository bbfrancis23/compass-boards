import { widgetRegistry } from "@/lib/widget-registry";
import { FormWidget, type FormWidgetConfig } from "@/lib/form-widget";

widgetRegistry.register<FormWidgetConfig>({
  type: "transaction-input",
  kind: "input",
  label: "Transaction",
  component: FormWidget,
  defaultSize: { w: 4, h: 3 },
  defaultConfig: {
    title: "Add Transaction",
    disclaimer: "Mock data only — not connected to any real bank account.",
    submitLabel: "Add",
    fields: [
      { key: "category", label: "Category", type: "text", required: true },
      { key: "merchant", label: "Merchant", type: "text", required: true },
      { key: "amount", label: "Amount", type: "number", required: true },
      { key: "date", label: "Date", type: "date", required: true },
    ],
  },
});
