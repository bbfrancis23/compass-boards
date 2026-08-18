"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetInstances } from "@/db/schema";

export interface LayoutUpdate {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export async function updateWidgetLayout(boardId: string, updates: LayoutUpdate[]) {
  await Promise.all(
    updates.map((update) => {
      const id = Number(update.id);
      if (!Number.isInteger(id)) {
        throw new Error(`Invalid widget instance id: "${update.id}"`);
      }

      return db
        .update(widgetInstances)
        .set({ x: update.x, y: update.y, w: update.w, h: update.h })
        .where(and(eq(widgetInstances.id, id), eq(widgetInstances.boardId, boardId)));
    }),
  );
}
