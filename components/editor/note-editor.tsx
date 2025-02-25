"use client";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { upsertNote } from "@/db/actions";
import type { Note } from "@/db/schema/note";
import { useNotesStore } from "@/stores/notes";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import isEqual from "lodash-es/isEqual";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "../emoji-picker";
import { cn } from "@/lib/utils";
import { useRouter } from "@/hooks/use-router";

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

export function NoteEditor(props: Props) {
  const initialNote = props.initialNote ?? {
    ...props.generatedNote,
    content: [] as any,
  };
  const editor = useCreateEditor({ value: initialNote?.content as any });
  const editorRef = useRef<HTMLDivElement>(null);
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNote({ ...note, title: e.target.value });
  };

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
            placeholder={
              props.generatedNote ? "Generating..." : "Type something..."
            }
            ref={editorRef}
            className={cn(
              "text-foreground-700 pb-24 relative",
              props.generatedNote?.content &&
                "after:absolute after:inset-0 after:bg-primary/15 after:pointer-events-none"
            )}
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
