"use client";

import { useEffect, useState } from "react";
import { getWidgetData } from "./widget-data-actions";

export interface UseWidgetDataResult {
  data: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
}

const GENERIC_ERROR = "Failed to load widget data.";

/** Fetches the widget_data rows (as plain JSON objects) for a widget instance. */
export function useWidgetData(boardId: string, widgetInstanceId: string): UseWidgetDataResult {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getWidgetData(boardId, widgetInstanceId)
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((err: unknown) => {
        console.error("Failed to load widget data", err);
        if (!cancelled) setError(GENERIC_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [boardId, widgetInstanceId]);

  return { data, loading, error };
}
