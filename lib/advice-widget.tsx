"use client";

import { useState } from "react";
import { Button, Loader, Stack, Text } from "@mantine/core";
import { ADVICE_ENABLED } from "./feature-flags";
import { useBoardAdvice } from "./use-board-advice";
import type { WidgetComponentProps } from "./widget-types";

export interface AdviceWidgetConfig {
  /** Widget title shown in WidgetShell's title bar (falls back to the registry label). */
  title?: string;
}

/**
 * Calls the board's advice Server Action and renders the response text.
 * Off by default — advice is only generated when the user asks for it,
 * since each generation is a slow, token-costly Claude call.
 */
export function AdviceWidget({ boardId }: WidgetComponentProps<AdviceWidgetConfig>) {
  const [enabled, setEnabled] = useState(false);
  const { advice, loading, error } = useBoardAdvice(boardId, enabled);

  if (!ADVICE_ENABLED) {
    return (
      <Text size="sm" c="dimmed">
        Advice generation is temporarily disabled until sign-in is added.
      </Text>
    );
  }

  if (!enabled) {
    return (
      <Stack gap="xs">
        <Text size="sm" c="dimmed">
          Get AI-generated advice based on this board&apos;s current data.
        </Text>
        <Button size="xs" onClick={() => setEnabled(true)} style={{ alignSelf: "start" }}>
          Generate advice
        </Button>
      </Stack>
    );
  }

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
