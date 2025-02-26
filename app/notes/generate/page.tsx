"use client";
import { NoteEditor } from "@/components/editor/note-editor";
import { useGeneratedNote } from "@/stores/generated-note";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GeneratedNotePage() {
  const { note } = useGeneratedNote();
  const router = useRouter();

  useEffect(() => {
    if (!note) {
      router.replace("/notes");
      return;
    }
  }, [note]);

  if (!note?.title) return null;

  return <NoteEditor generatedNote={note} key={note.title + note.emoji} />;
}
