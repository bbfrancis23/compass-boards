"use client";

import { useState } from "react";
import { GridLayout, useContainerWidth, type Layout } from "react-grid-layout";

const initialLayout: Layout = [{ i: "a", x: 0, y: 0, w: 3, h: 2 }];

export default function TestGridPage() {
  const { width, containerRef, mounted } = useContainerWidth();
  const [layout, setLayout] = useState<Layout>(initialLayout);

  return (
    <div style={{ padding: 24 }}>
      <h1>react-grid-layout test</h1>
      <p>Drag or resize the box below to confirm the grid is wired up.</p>
      <div ref={containerRef}>
        {mounted && (
          <GridLayout
            width={width}
            layout={layout}
            gridConfig={{ cols: 12, rowHeight: 60 }}
            onLayoutChange={setLayout}
          >
            <div key="a" style={{ background: "#4dabf7", borderRadius: 8 }}>
              drag me
            </div>
          </GridLayout>
        )}
      </div>
    </div>
  );
}
