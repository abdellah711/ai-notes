import {
  vector,
  pgTable,
  text,
  index,
  integer,
  serial,
} from "drizzle-orm/pg-core";
import { noteTable } from "./note";
import { user } from "./auth";

export const embeddingTable = pgTable(
  "embedding",
  {
    embeddingId: serial("embedding_id").primaryKey(),
    embedding: vector("embedding", { dimensions: 768 }).notNull(),
    noteId: integer("note_id")
      .notNull()
      .unique()
      .references(() => noteTable.noteId, { onDelete: "cascade" }),
    content: text("content").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  ]
);

export type Embedding = typeof embeddingTable.$inferSelect;
