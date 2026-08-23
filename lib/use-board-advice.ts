"use client";

import { useEffect, useState } from "react";
import { getBoardAdvice } from "./advice-actions";

export interface UseBoardAdviceResult {
  advice: string | null;
  loading: boolean;
  error: string | null;
}

const GENERIC_ERROR = "Failed to load advice.";

/**
 * Fetches AI-generated advice for a board via the getBoardAdvice server
 * action. Only fires while `enabled` is true, so callers can gate the
 * (slow, token-costly) request behind an explicit user action instead of
 * firing it automatically on mount.
 */
export function useBoardAdvice(boardId: string, enabled: boolean): UseBoardAdviceResult {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset loading/error as soon as a new request starts, rather than
  // synchronously inside the effect below, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const requestKey = enabled ? boardId : null;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    if (requestKey !== null) {
      setLoading(true);
      setError(null);
    } else {
      // Disabling cancels any in-flight request (see the effect's cleanup
      // below), so its `.finally` never runs to clear `loading` itself.
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    getBoardAdvice(boardId)
      .then((result) => {
        if (!cancelled) setAdvice(result);
      })
      .catch((err: unknown) => {
        console.error("Failed to load board advice", err);
        if (!cancelled) setError(GENERIC_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [boardId, enabled]);

  return { advice, loading, error };
}
