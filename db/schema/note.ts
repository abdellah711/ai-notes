import { boolean, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import { timestamps } from "../columns";
import { user } from "./auth";

export const noteTable = pgTable("notes", {
  noteId: serial("note_id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").default(""),
  emoji: text("emoji").default("📄"),
  content: jsonb("content").default("[]"),
  isKnowledgeNote: boolean("is_knowledge_note").default(false),
  ...timestamps,
});

export type Note = typeof noteTable.$inferSelect;
