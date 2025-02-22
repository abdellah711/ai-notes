"use client";

import { useNotesStore } from "@/stores/notes";
import { Button, Skeleton } from "@nextui-org/react";
import { formatRelative } from "date-fns/formatRelative";
import Link from "next/link";

export default function notFound() {
  const notes = useNotesStore((state) => state.notes);
  const isLoading = useNotesStore((state) => state.isLoading);

  return (
    <div className="size-full pt-10 text-base sm:px-[max(30px,calc(50%-350px))]">
      <h1 className="text-3xl">404 - Note not found</h1>
      <p className="text-foreground-500 my-5">
        The note you are looking for does not exist
      </p>
      <p className="text-sm text-foreground-500 mb-3">Available notes</p>
      <ul className="flex flex-col gap-3">
        {isLoading &&
          new Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="w-full h-6 rounded-md" />
            ))}
        {notes.slice(0, 5).map((note) => (
          <Button
            key={note.noteId}
            href={`/notes/${note.noteId}`}
            variant="flat"
            className="justify-start"
            as={Link}
            startContent={<span>{note.emoji}</span>}
            endContent={
              <p className="ms-auto text-sm text-foreground-400">
                {formatRelative(note.updatedAt ?? note.createdAt, Date.now())}
              </p>
            }
          >
            {note.title || "Untitled"}
          </Button>
        ))}
      </ul>
    </div>
  );
}
