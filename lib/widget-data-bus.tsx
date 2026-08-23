"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface WidgetDataBusValue {
  /** Per-widget-instance version counter; bumps whenever that instance's data changes. */
  versions: Record<string, number>;
  /** Call after a write succeeds so any reader of that widget instance's data refetches. */
  notifyWidgetDataChanged: (widgetInstanceId: string) => void;
}

const WidgetDataBusContext = createContext<WidgetDataBusValue | null>(null);

// Stable reference so callers outside a provider (or in tests) get a
// referentially-stable no-op instead of a fresh function every render.
function noop() {}

export function WidgetDataBusProvider({ children }: { children: React.ReactNode }) {
  const [versions, setVersions] = useState<Record<string, number>>({});

  const notifyWidgetDataChanged = useCallback((widgetInstanceId: string) => {
    setVersions((prev) => ({
      ...prev,
      [widgetInstanceId]: (prev[widgetInstanceId] ?? 0) + 1,
    }));
  }, []);

  return (
    <WidgetDataBusContext.Provider value={{ versions, notifyWidgetDataChanged }}>
      {children}
    </WidgetDataBusContext.Provider>
  );
}

/** Version counter for one widget instance's data; bumps whenever a sibling write targets it. */
export function useWidgetDataVersion(widgetInstanceId: string): number {
  const ctx = useContext(WidgetDataBusContext);
  return ctx?.versions[widgetInstanceId] ?? 0;
}

/** Notifies the bus that widgetInstanceId's data changed, so any reader refetches. No-op outside a provider. */
export function useNotifyWidgetDataChanged(): (widgetInstanceId: string) => void {
  const ctx = useContext(WidgetDataBusContext);
  return ctx?.notifyWidgetDataChanged ?? noop;
}
