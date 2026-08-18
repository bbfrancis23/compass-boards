import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const boards = sqliteTable("boards", {
  id: text("id").primaryKey(),
  domain: text("domain").notNull(),
  label: text("label").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const widgetInstances = sqliteTable("widget_instances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  boardId: text("board_id")
    .notNull()
    .references(() => boards.id),
  type: text("type").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  w: integer("w").notNull(),
  h: integer("h").notNull(),
  config: text("config", { mode: "json" }).$type<Record<string, unknown>>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const widgetData = sqliteTable("widget_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  widgetInstanceId: integer("widget_instance_id")
    .notNull()
    .references(() => widgetInstances.id),
  data: text("data", { mode: "json" }).notNull().$type<Record<string, unknown>>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
