"use client";
import { NoteEditor } from "@/components/editor/note-editor";
import { useNotesStore } from "@/stores/notes";

export default function KnowledgePage() {
  const note = useNotesStore((state) => state.notes)?.filter(
    (note) => note.isKnowledgeNote
  )[0];

  if (!note) return null;

  return <NoteEditor initialNote={note} />;
}
