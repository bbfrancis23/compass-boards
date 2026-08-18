# widgets/

Widget components, grouped by domain: `widgets/<domain>/...` (e.g. `widgets/financial/`, `widgets/fitness/`). Widgets that aren't tied to one domain (e.g. `advice.ts`) live directly in `widgets/`.

Each widget type self-registers with the widget registry (see `lib/`) from its own file. Within an existing domain folder, that means a new widget is added by dropping a file in `widgets/<domain>/` and adding it to that folder's `index.ts` — no changes needed outside the folder. A brand-new domain, or a root-level (non-domain) widget like `advice.ts`, does need one addition elsewhere: an import line in `app/register-widgets.tsx`, so its registration actually reaches the browser bundle (see that file's comment for why).
