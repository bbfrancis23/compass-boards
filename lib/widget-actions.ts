"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { widgetInstances } from "@/db/schema";

export interface LayoutUpdate {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export async function updateWidgetLayout(updates: LayoutUpdate[]) {
  await Promise.all(
    updates.map((update) =>
      db
        .update(widgetInstances)
        .set({ x: update.x, y: update.y, w: update.w, h: update.h })
        .where(eq(widgetInstances.id, Number(update.id))),
    ),
  );
}
