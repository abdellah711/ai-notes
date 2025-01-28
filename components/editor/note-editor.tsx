"use client";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { updateNote } from "@/db/actions";
import type { Note } from "@/db/schema/note";
import { useNotesStore } from "@/stores/notes";
import { useMutation } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import isEqual from "lodash-es/isEqual";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "../emoji-picker";

type Props = {
  note: Note;
};

const SAVING_DELAY = 2000;

export function NoteEditor({ note: initialNote }: Props) {
  const editor = useCreateEditor({ value: initialNote.content as any });
  const editorRef = useRef<HTMLDivElement>(null);
  const updateStateNote = useNotesStore((state) => state.updateNote);
  const {
    mutateAsync: saveNote,
    variables: savedNote = initialNote,
    isPending,
    data = initialNote,
  } = useMutation({
    mutationFn: updateNote,
    onSuccess: (data) => {
      updateStateNote(data);
    },
  });
  const [note, setNote] = useState(initialNote);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, title: e.target.value });
  };

  const isTheSameNote =
    note.title === savedNote.title &&
    isEqual(note.content, savedNote.content) &&
    note.emoji === savedNote.emoji;

  useEffect(() => {
    if (isTheSameNote) {
      return;
    }
    const timer = setTimeout(() => {
      saveNote({
        noteId: note.noteId,
        title: note.title ?? "",
        content: editor.children,
        emoji: note.emoji ?? undefined,
      });
    }, SAVING_DELAY);
    return () => clearTimeout(timer);
  }, [note]);

  const handleEmojiChange = (emoji: string) => {
    const newNote = { ...note, emoji };
    setNote(newNote);
    updateStateNote(newNote);
  };

  return (
    <div className="size-full px-12 pb-24 pt-4 text-base sm:px-[max(30px,calc(50%-350px))]">
      <div className="flex items-center gap-2 justify-between">
        <EmojiPicker emoji={note.emoji!} onSelect={handleEmojiChange} />
        <p className="text-sm text-foreground-500 mt-5 mb-2">
          {isPending
            ? "Saving..."
            : isTheSameNote
            ? `Saved at ${formatRelative(
                data?.updatedAt ?? data.createdAt,
                Date.now()
              )}`
            : "Unsaved changes"}
        </p>
      </div>
      <Plate
        editor={editor}
        onValueChange={({ value }) => setNote({ ...note, content: value })}
      >
        <input
          placeholder="Untitled"
          className="outline-none text-4xl font-[inherit] bg-transparent font-bold text-foreground-800 mb-7 placeholder:font-normal"
          value={note.title ?? ""}
          onChange={handleTitleChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              editorRef.current?.focus();
            }
          }}
        />
        <EditorContainer>
          <Editor
            variant="none"
            placeholder="Type something..."
            ref={editorRef}
            className="text-foreground-700 pb-24"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "b") {
                e.stopPropagation();
              }
            }}
          />
        </EditorContainer>
      </Plate>
    </div>
  );
}
