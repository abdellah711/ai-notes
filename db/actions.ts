"use server";
import { auth } from "@/lib/auth";
import { generateNoteEmbedding } from "@/lib/embedding";
import { serializeMdNodes } from "@udecode/plate-markdown";
import { and, eq } from "drizzle-orm";
import isEqual from "lodash-es/isEqual";
import { headers } from "next/headers";
import { cache } from "react";
import "server-only";
import { z } from "zod";
import { db } from ".";
import { embeddingTable } from "./schema/embedding";
import { noteTable } from "./schema/note";
import { redirect } from "next/navigation";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
});

export const createEmptyNote = async () => {
  const session = await getSession();

  const newNote = await db
    .insert(noteTable)
    .values({
      userId: session.user.id,
    })
    .returning();

  return newNote[0];
};

export const getNotes = async () => {
  const session = await getSession();
  return db
    .select()
    .from(noteTable)
    .where(eq(noteTable.userId, session.user.id))
    .orderBy(noteTable.createdAt);
};

export const getNote = async (noteId: string) => {
  if (!noteId || isNaN(+noteId)) {
    throw new Error("Note not found");
  }
  const session = await getSession();

  const note = await db
    .select()
    .from(noteTable)
    .where(
      and(eq(noteTable.noteId, +noteId), eq(noteTable.userId, session.user.id))
    )
    .limit(1);

  if (!note.length) {
    throw new Error("Note not found");
  }

  return note[0];
};

const UpdateNoteSchema = z.object({
  noteId: z.number().int().optional(),
  title: z.string(),
  content: z.array(z.any()),
  emoji: z.string().optional(),
});

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export const upsertNote = async (data: UpdateNote) => {
  const note = UpdateNoteSchema.parse(data);

  if (!note.noteId) {
    return createNote(note);
  }

  const [session, [existingNote]] = await Promise.all([
    getSession(),
    db
      .select()
      .from(noteTable)
      .where(eq(noteTable.noteId, note.noteId))
      .limit(1),
  ]);

  if (existingNote.userId !== session.user.id) {
    throw new Error("Note not found");
  }

  const markdown = serializeMdNodes(note.content);

  return db.transaction(async (tx) => {
    const updatedNote = tx
      .update(noteTable)
      .set({
        title: note.title,
        content: note.content,
        updatedAt: new Date(),
        emoji: note.emoji,
      })
      .where(
        and(
          eq(noteTable.noteId, note.noteId!),
          eq(noteTable.userId, session.user.id)
        )
      )
      .returning()
      .then((res) => res[0]);

    if (
      existingNote.title?.trim() === note.title.trim() &&
      isEqual(existingNote.content, note.content)
    ) {
      return updatedNote;
    }

    await generateNoteEmbedding(note).then((embedding) =>
      tx
        .insert(embeddingTable)
        .values({
          noteId: note.noteId!,
          content: markdown,
          embedding,
          userId: session.user.id,
        })
        .onConflictDoUpdate({
          target: embeddingTable.noteId,
          set: {
            content: markdown,
            embedding,
          },
        })
    );
    return updatedNote;
  });
};

export const deleteNote = async (noteId: number) => {
  const session = await getSession();
  const deletedNote = db
    .delete(noteTable)
    .where(
      and(eq(noteTable.noteId, noteId), eq(noteTable.userId, session.user.id))
    )
    .returning()
    .then((res) => res[0]);
  await db.delete(embeddingTable).where(eq(embeddingTable.noteId, noteId));

  return deletedNote;
};

const createNote = async (note: UpdateNote) => {
  const session = await getSession();
  const markdown = serializeMdNodes(note.content);
  const newNotePromise = db
    .insert(noteTable)
    .values({
      ...note,
      userId: session.user.id,
    })
    .returning()
    .then((res) => res[0]);
  const embedding = await generateNoteEmbedding(note);
  const newNote = await newNotePromise;
  await db.insert(embeddingTable).values({
    content: markdown,
    embedding,
    noteId: newNote.noteId,
    userId: session.user.id,
  });
  return newNote;
};
