import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const boards = sqliteTable(
  "boards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    // Auth.js session.user.id (the GitHub account's numeric id, as a string).
    userId: text("user_id").notNull(),
    domain: text("domain").notNull(),
    label: text("label").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [uniqueIndex("boards_user_domain_unique").on(table.userId, table.domain)],
);

export const widgetInstances = sqliteTable("widget_instances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  boardId: integer("board_id")
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
