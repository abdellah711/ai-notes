"use client";
import type { Note } from "@/db/schema/note";
import {
  createContext,
  PropsWithChildren,
  Suspense,
  use,
  useEffect,
  useRef,
} from "react";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

const createNotesStore = () => {
  return createStore(
    combine(
      {
        notes: [] as Note[],
        isLoading: true,
      },
      (set) => ({
        setNotes: (notes: Note[]) => set({ notes, isLoading: false }),
        updateNote: (note: Note) =>
          set((state) => ({
            notes: state.notes.map((n) =>
              n.noteId === note.noteId ? note : n
            ),
          })),
        addNote: (note: Note) =>
          set((state) => ({ notes: [...state.notes, note] })),
      })
    )
  );
};

type NotesStoreType = ReturnType<
  ReturnType<typeof createNotesStore>["getInitialState"]
>;
type NotesStoreApi = ReturnType<typeof createNotesStore>;

const NotesStoreContext = createContext<NotesStoreApi | undefined>(undefined);

export const NotesStoreProvider = ({
  children,
  notesPromise,
}: PropsWithChildren<{ notesPromise: Promise<Note[]> }>) => {
  const storeRef = useRef<ReturnType<typeof createNotesStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createNotesStore();
  }
  return (
    <NotesStoreContext value={storeRef.current}>
      <Suspense>
        <NotesInitialiser notesPromise={notesPromise} />
      </Suspense>
      {children}
    </NotesStoreContext>
  );
};

export const useNotesStore = <T,>(
  selector: (state: NotesStoreType) => T
): T => {
  const context = use(NotesStoreContext);
  if (!context) {
    throw new Error("useNotesStore must be used within a NotesStoreProvider");
  }
  return useStore(context, selector);
};

const NotesInitialiser = ({
  notesPromise,
}: {
  notesPromise: Promise<Note[]>;
}) => {
  const notes = use(notesPromise);
  const { isLoading, setNotes } = useNotesStore((state) => state);
  useEffect(() => {
    if (isLoading) {
      setNotes(notes);
    }
  }, []);
  return null;
};
