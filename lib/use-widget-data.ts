"use client";

import { useEffect, useState } from "react";
import { getWidgetData } from "./widget-data-actions";
import { useWidgetDataVersion } from "./widget-data-bus";

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
  const version = useWidgetDataVersion(widgetInstanceId);

  // Reset loading/error as soon as a new request starts, rather than
  // synchronously inside the effect below, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const requestKey = `${boardId}:${widgetInstanceId}`;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    getWidgetData(boardId, widgetInstanceId)
      .then((rows) => {
        if (!cancelled) {
          setData(rows);
          setError(null);
        }
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
  }, [boardId, widgetInstanceId, version]);

  return { data, loading, error };
}
