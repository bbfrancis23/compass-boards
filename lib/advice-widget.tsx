"use client";

import { Loader, Text } from "@mantine/core";
import { useBoardAdvice } from "./use-board-advice";
import type { WidgetComponentProps } from "./widget-types";

export interface AdviceWidgetConfig {
  /** Widget title shown in WidgetShell's title bar (falls back to the registry label). */
  title?: string;
}

/** Calls the board's advice Server Action and renders the response text. */
export function AdviceWidget({ boardId }: WidgetComponentProps<AdviceWidgetConfig>) {
  const { advice, loading, error } = useBoardAdvice(boardId);

  if (loading) return <Loader size="sm" />;
  if (error) {
    return (
      <Text c="red" size="sm">
        {error}
      </Text>
    );
  }
  if (!advice) {
    return (
      <Text size="sm" c="dimmed">
        No advice yet.
      </Text>
    );
  }

  return (
    <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
      {advice}
    </Text>
  );
}
