"use client";

// Side-effect imports: each file registers its widget type with the
// registry. Rendered once from the root layout so every board's widget
// types are registered in both the SSR and browser module graphs,
// regardless of which board page is active.
import "@/widgets/financial";

export function RegisterWidgets() {
  return null;
}
