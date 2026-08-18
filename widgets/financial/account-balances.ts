import { widgetRegistry } from "@/lib/widget-registry";
import { FormWidget, type FormWidgetConfig } from "@/lib/form-widget";

widgetRegistry.register<FormWidgetConfig>({
  type: "account-balances",
  kind: "input",
  label: "Account Balance",
  component: FormWidget,
  defaultSize: { w: 4, h: 3 },
  defaultConfig: {
    title: "Add Account Balance",
    disclaimer: "Mock data only — not connected to any real bank account.",
    submitLabel: "Add",
    fields: [
      { key: "name", label: "Account name", type: "text", required: true },
      { key: "balance", label: "Balance", type: "number", required: true },
    ],
  },
});
