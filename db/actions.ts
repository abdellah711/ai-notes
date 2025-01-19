"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";
import { db } from ".";
import { noteTable } from "./schema/note";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

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

  redirect(`/notes/${newNote[0].noteId}`);
};

export const getNotes = async () => {
  const session = await getSession();
  return db
    .select()
    .from(noteTable)
    .where(eq(noteTable.userId, session.user.id));
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
