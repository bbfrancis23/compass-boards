"use client";

import type { ReactNode } from "react";
import { ActionIcon, Group, Paper, Text } from "@mantine/core";

export interface WidgetShellProps {
  title: string;
  onRemove?: () => void;
  children: ReactNode;
}

/**
 * Shared chrome around every widget: title bar (also the react-grid-layout
 * drag handle), remove button, and a scrollable content area.
 *
 * DashboardCanvas should still configure react-grid-layout with
 * `dragConfig={{ handle: ".widget-drag-handle", cancel: ".widget-remove-button" }}`
 * for keyboard/other input paths, but the remove button also stops
 * mousedown/pointerdown propagation itself so it can't start a drag even if
 * that config is missed or misconfigured.
 */
export function WidgetShell({ title, onRemove, children }: WidgetShellProps) {
  return (
    <Paper
      withBorder
      radius="md"
      
      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      <Group
        justify="space-between"
        wrap="nowrap"
        px="sm"
        py="xs"
        bg={"earthBrown.7"}
        className="widget-drag-handle"
        style={{ cursor: "grab", borderBottom: "1px solid var(--mantine-color-default-border)" }}
      >
        <Text size="sm" fw={600} c={"white"} truncate >
          {title}
        </Text>
        {onRemove && (
          <ActionIcon
            className="widget-remove-button"
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={`Remove ${title}`}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRemove}
          >
            ×
          </ActionIcon>
        )}
      </Group>
      <div style={{ flex: 1, overflow: "auto", padding: "var(--mantine-spacing-sm)" }}>
        {children}
      </div>
    </Paper>
  );
}
