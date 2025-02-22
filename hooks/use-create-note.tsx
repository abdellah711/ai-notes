"use client";

import { useMutation } from "@tanstack/react-query";
import { useNotesStore } from "@/stores/notes";
import { useRouter } from "next/navigation";
import { createNewNote } from "@/db/actions";

export const useCreateNote = () => {
  const router = useRouter();
  const addNote = useNotesStore((state) => state.addNote);
  const { isPending, mutate, ...rest } = useMutation({
    mutationFn: createNewNote,
    onSuccess: (data) => {
      if (!data.noteId) return;
      addNote(data);
      router.push(`/notes/${data.noteId}`);
    },
  });

  return { isPending, createNewNote: mutate, ...rest };
};
