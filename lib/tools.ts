import { getSession } from "@/db/actions";
import {
  and,
  cosineDistance,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  sql,
} from "drizzle-orm";
import { generateEmbedding } from "./embedding";
import { embeddingTable } from "@/db/schema/embedding";
import { db } from "@/db";
import { noteTable } from "@/db/schema/note";

export const findRelatedNotes = async (query: string) => {
  const [session, embedding] = await Promise.all([
    getSession(),
    generateEmbedding(query),
  ]);

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingTable.embedding,
    embedding
  )})`;

  const notes = await db
    .select({
      content: embeddingTable.content,
      title: noteTable.title,
      createdAt: noteTable.createdAt,
      similarity,
    })
    .from(embeddingTable)
    .where(and(eq(embeddingTable.userId, session.user.id), gt(similarity, 0.5)))
    .innerJoin(noteTable, eq(embeddingTable.noteId, noteTable.noteId))
    .orderBy((t) => desc(t.similarity))
    .limit(3);
  return notes;
};

export const getNotes = async (skip = 0) => {
  const session = await getSession();
  const { content, ...columns } = getTableColumns(noteTable);
  const notes = await db
    .select({
      ...columns,
      totalNotes: sql<number>`count(*) over ()`,
    })
    .from(noteTable)
    .where(eq(noteTable.userId, session.user.id))
    .orderBy(desc(noteTable.createdAt))
    .offset(skip)
    .limit(10);
  return {
    notes: notes.map((note) => ({
      ...note,
      title: note.title || "Untitled",
    })),
    totalNotes: notes?.[0].totalNotes ?? 0,
  };
};

export const getNotesDetails = async (noteIds: number[]) => {
  const session = await getSession();
  const notes = await db
    .select()
    .from(noteTable)
    .where(
      and(
        eq(noteTable.userId, session.user.id),
        inArray(noteTable.noteId, noteIds.slice(0, 3))
      )
    )
    .limit(1);
  return notes;
};
