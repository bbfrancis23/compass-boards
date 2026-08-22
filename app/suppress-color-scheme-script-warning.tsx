"use client";

// Mantine's <ColorSchemeScript> (in app/layout.tsx's <head>) is a client
// component whose whole job is to render a raw <script> tag that sets
// data-mantine-color-scheme on <html> before hydration, to avoid a flash
// of the wrong color scheme. React 19 warns about any <script> tag
// rendered by a component, with no exception for this "must run once via
// the initial SSR HTML, never needs to re-run on the client" pattern —
// this is a known, dev-only, upstream false positive (same warning hits
// next-themes and other theme libraries for the same reason; see #65).
// Filter just this one known-safe message rather than the whole console,
// and only in development — production builds never emit it.
//
// This module's top-level side effect re-runs on every Fast Refresh/HMR
// reload, so guard on a global flag — otherwise each reload wraps the
// already-wrapped console.error again, nesting closures indefinitely.
const globalFlag = globalThis as typeof globalThis & {
  __suppressColorSchemeScriptWarningInstalled?: boolean;
};

if (process.env.NODE_ENV === "development" && !globalFlag.__suppressColorSchemeScriptWarningInstalled) {
  globalFlag.__suppressColorSchemeScriptWarningInstalled = true;
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    // .apply(console, ...) rather than a bare call, so console.error keeps
    // its expected `this` binding when forwarding.
    originalConsoleError.apply(console, args);
  };
}

export function SuppressColorSchemeScriptWarning() {
  return null;
}
