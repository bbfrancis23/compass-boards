"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ResponsiveGridLayout, useContainerWidth, type Layout } from "react-grid-layout";
import "react-resizable/css/styles.css";
import { updateWidgetLayout } from "./widget-actions";
import { widgetRegistry } from "./widget-registry";
import { WidgetShell } from "./widget-shell";
import type { WidgetInstance } from "./widget-types";

export interface DashboardCanvasProps {
  boardId: string;
  widgets: WidgetInstance[];
}

const SAVE_DEBOUNCE_MS = 500;

export function DashboardCanvas({ boardId, widgets }: DashboardCanvasProps) {
  const { width, containerRef } = useContainerWidth();
  const [layout, setLayout] = useState<Layout>(() =>
    widgets.map((widget) => ({ i: widget.id, x: widget.x, y: widget.y, w: widget.w, h: widget.h })),
  );
  const widgetsById = useMemo(
    () => new Map(widgets.map((widget) => [widget.id, widget])),
    [widgets],
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLayoutChange = useCallback((nextLayout: Layout) => {
    setLayout(nextLayout);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      updateWidgetLayout(
        nextLayout.map((item) => ({ id: item.i, x: item.x, y: item.y, w: item.w, h: item.h })),
      ).catch((error) => console.error("Failed to save widget layout", error));
    }, SAVE_DEBOUNCE_MS);
  }, []);

  return (
    <div ref={containerRef}>
      <ResponsiveGridLayout
        width={width}
        layouts={{ lg: layout }}
        rowHeight={60}
        dragConfig={{ handle: ".widget-drag-handle", cancel: ".widget-remove-button" }}
        onLayoutChange={handleLayoutChange}
      >
        {layout.map((item) => {
          const widget = widgetsById.get(item.i);
          if (!widget) return null;
          const definition = widgetRegistry.get(widget.type);

          return (
            <div key={widget.id}>
              <WidgetShell title={definition?.label ?? widget.type}>
                {definition ? (
                  <definition.component instance={widget} boardId={boardId} />
                ) : (
                  <div>Unknown widget type: {widget.type}</div>
                )}
              </WidgetShell>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}
