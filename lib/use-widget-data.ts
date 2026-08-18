"use client";

import { useEffect, useState } from "react";
import { getWidgetData } from "./widget-data-actions";

export interface UseWidgetDataResult {
  data: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
}

/** Fetches the widget_data rows (as plain JSON objects) for a widget instance. */
export function useWidgetData(widgetInstanceId: string): UseWidgetDataResult {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getWidgetData(widgetInstanceId)
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [widgetInstanceId]);

  return { data, loading, error };
}
