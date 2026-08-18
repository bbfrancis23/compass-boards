# widgets/

Widget components, grouped by domain: `widgets/<domain>/...` (e.g. `widgets/financial/`, `widgets/fitness/`).

Each widget type self-registers with the widget registry (see `lib/`) from its own file, so a new widget is added by dropping a file in the right domain folder rather than editing a central list.
