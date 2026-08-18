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
 * DashboardCanvas should configure react-grid-layout with
 * `dragConfig={{ handle: ".widget-drag-handle", cancel: ".widget-remove-button" }}`
 * so dragging starts from the title bar without the remove button
 * triggering a drag.
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
        className="widget-drag-handle"
        style={{ cursor: "grab", borderBottom: "1px solid var(--mantine-color-default-border)" }}
      >
        <Text size="sm" fw={600} truncate>
          {title}
        </Text>
        {onRemove && (
          <ActionIcon
            className="widget-remove-button"
            variant="subtle"
            color="gray"
            size="sm"
            aria-label={`Remove ${title}`}
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
