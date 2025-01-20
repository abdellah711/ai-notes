"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import { db } from ".";
import { noteTable } from "./schema/note";
import { and, eq } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";

const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
});

export const createNewNote = async () => {
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
  noteId: z.number().int(),
  title: z.string(),
  content: z.array(z.any()),
});

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

export const updateNote = async (data: UpdateNote) => {
  const note = UpdateNoteSchema.parse(data);
  const session = await getSession();

  return await db
    .update(noteTable)
    .set({
      title: note.title,
      content: note.content,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(noteTable.noteId, note.noteId),
        eq(noteTable.userId, session.user.id)
      )
    )
    .returning()
    .then((res) => res[0]);
};
