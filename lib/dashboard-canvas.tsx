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

  // Reconcile layout state when the widgets prop changes (widgets added or
  // removed elsewhere, or a page refetch), keeping the in-session position
  // of any widget that's still present rather than resetting everything to
  // its last-saved position. Adjusted during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes.
  const [prevWidgets, setPrevWidgets] = useState(widgets);
  if (prevWidgets !== widgets) {
    setPrevWidgets(widgets);
    setLayout((prevLayout) => {
      const prevById = new Map(prevLayout.map((item) => [item.i, item]));
      return widgets.map(
        (widget) =>
          prevById.get(widget.id) ?? {
            i: widget.id,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h,
          },
      );
    });
  }

  const handleLayoutChange = useCallback(
    (nextLayout: Layout) => {
      setLayout(nextLayout);

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        updateWidgetLayout(
          boardId,
          nextLayout.map((item) => ({ id: item.i, x: item.x, y: item.y, w: item.w, h: item.h })),
        ).catch((error) => console.error("Failed to save widget layout", error));
      }, SAVE_DEBOUNCE_MS);
    },
    [boardId],
  );

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
          const configTitle =
            typeof widget.config?.title === "string" ? widget.config.title.trim() : "";
          const instanceTitle = configTitle.length > 0 ? configTitle : undefined;

          return (
            <div key={widget.id}>
              <WidgetShell title={instanceTitle ?? definition?.label ?? widget.type}>
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
