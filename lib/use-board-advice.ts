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

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

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
