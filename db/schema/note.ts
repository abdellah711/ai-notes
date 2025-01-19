import { jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "../columns";
import { user } from "./auth";

export const noteTable = pgTable("notes", {
  noteId: serial("note_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").default(""),
  content: jsonb("content").default("[]"),
  ...timestamps,
});

export type Note = typeof noteTable.$inferSelect;
