"use client";

// Side-effect imports: each file registers its widget type with the
// registry. This is a client component so these imports land in the
// browser bundle (the widget registry is a module-level singleton, and
// registrations reached only through server-side imports don't populate
// the browser's copy). Rendered once from the root layout, regardless of
// which board page is active. Add each new domain's widgets import here
// as it's built.
import "@/widgets/financial";
import "@/widgets/fitness";

export function RegisterWidgets() {
  return null;
}
