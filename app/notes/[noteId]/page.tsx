"use client";
import { NoteEditor } from "@/components/editor/note-editor";
import { useNotesStore } from "@/stores/notes";
import { notFound, useParams } from "next/navigation";
import NoteLoading from "./loading";
import { useMemo } from "react";

export default function NotePage() {
  const { noteId } = useParams();
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);
  const note = useMemo(
    () => notes.find((n) => n.noteId === Number(noteId)),
    [noteId, isLoading]
  );
  if (isLoading) return <NoteLoading />;

  if (!note) return notFound();

  return <NoteEditor initialNote={note} />;
}
