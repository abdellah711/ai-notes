"use server";
import { db } from "@/db";
import { getSession } from "@/db/actions";
import { embeddingTable } from "@/db/schema/embedding";
import { Note, noteTable } from "@/db/schema/note";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

const generateEmbedding = async (value: string) => {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const model = google.textEmbeddingModel("text-embedding-004");

  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
};

export const generateNoteEmbedding = async (
  note: Pick<Note, "title" | "content">
) => {
  return generateEmbedding(`Title: ${note.title}\n\nContent: ${note.content}`);
};

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
