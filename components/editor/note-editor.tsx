"use client";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { upsertNote } from "@/db/actions";
import type { Note } from "@/db/schema/note";
import { useRouter } from "@/hooks/use-router";
import { useNotesStore } from "@/stores/notes";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import isEqual from "lodash-es/isEqual";
import { useEffect, useState } from "react";
import EmojiPicker from "../emoji-picker";
import BaseEditor from "./base-editor";

type Props =
  | {
      initialNote: Note;
      generatedNote?: undefined;
    }
  | {
      initialNote?: undefined;
      generatedNote: {
        title: string;
        content: string;
        emoji: string;
      } & Partial<Note>;
    };

const SAVING_DELAY = 2000;

const KNOWLEDGE_NOTE_DESCRIPTION = `This note is used by the AI to store knowledge and information about you and your discussions. It is a safe place to write down any information that you want the AI to know...`;

export function NoteEditor(props: Props) {
  const initialNote = props.initialNote ?? {
    ...props.generatedNote,
    content: [] as any,
  };
  const editor = useCreateEditor({ value: initialNote?.content as any });
  const updateStateNote = useNotesStore((state) => state.updateNote);
  const insertNote = useNotesStore((state) => state.insertNote);
  const router = useRouter();
  const {
    mutateAsync: saveNote,
    variables: savedNote = initialNote,
    isPending,
    data = initialNote,
  } = useMutation({
    mutationFn: upsertNote,
    onSuccess: (data, variables) => {
      if (!variables.noteId) {
        insertNote(data);
        router.push(`/notes/${data.noteId}`);
      }
      updateStateNote(data);
    },
  });
  const [note, setNote] = useState(initialNote);

  const isTheSameNote =
    note.title === savedNote.title &&
    isEqual(note.content, savedNote.content) &&
    note.emoji === savedNote.emoji;

  useEffect(() => {
    if (isTheSameNote || !note.noteId) {
      return;
    }
    const timer = setTimeout(() => {
      saveNote({
        noteId: note.noteId!,
        title: note.title ?? "",
        content: editor.children,
        emoji: note.emoji ?? undefined,
      });
    }, SAVING_DELAY);
    return () => clearTimeout(timer);
  }, [note]);

  useEffect(() => {
    if (!props.generatedNote?.content) return;
    editor.tf.setValue(
      editor.api.markdown.deserialize(props.generatedNote.content)
    );
  }, [props.generatedNote?.content]);

  const handleEmojiChange = (emoji: string) => {
    const newNote = { ...note, emoji };
    setNote(newNote);
    if (note.noteId) {
      updateStateNote(newNote as Note);
    }
  };

  const renderSaveStatus = () => {
    if (props.generatedNote) {
      return (
        <Button
          isLoading={isPending}
          color="primary"
          onPress={() =>
            saveNote({
              title: note.title ?? "",
              content: editor.children,
              emoji: note.emoji ?? undefined,
            })
          }
        >
          {isPending || router.isNavigating ? "Saving..." : "Save"}
        </Button>
      );
    }

    if (!data.createdAt) return null;

    return (
      <p className="text-sm text-foreground-500 mt-5 mb-2">
        {isPending
          ? "Saving..."
          : isTheSameNote
          ? `Saved at ${formatRelative(
              data?.updatedAt ?? data.createdAt!,
              Date.now()
            )}`
          : "Unsaved changes"}
      </p>
    );
  };

  return (
    <div className="size-full px-12 pb-24 pt-4 text-base sm:px-[max(30px,calc(50%-350px))]">
      <div className="flex items-center gap-2 justify-between">
        <EmojiPicker emoji={note.emoji!} onSelect={handleEmojiChange} />
        {renderSaveStatus()}
      </div>
      <BaseEditor
        editor={editor}
        title={note.title ?? ""}
        onTitleChange={(title) => setNote({ ...note, title })}
        placeholder={
          props.generatedNote
            ? "Generating..."
            : note?.isKnowledgeNote
            ? KNOWLEDGE_NOTE_DESCRIPTION
            : "Type something..."
        }
        className={
          props.generatedNote?.content &&
          "after:absolute after:inset-0 after:bg-primary/15 after:pointer-events-none"
        }
        onChange={(content) => setNote({ ...note, content })}
      />
    </div>
  );
}
