import { create } from "zustand";
import { combine } from "zustand/middleware";

interface GeneratedNote {
  note?: {
    title: string;
    content: string;
    emoji: string;
  };
}

export const useGeneratedNote = create(
  combine(
    {
      note: undefined,
    } as GeneratedNote,
    (set) => ({
      setGeneratedNote: (note: GeneratedNote["note"]) => set({ note }),
      updateContent: (content: string) =>
        set((state) => ({
          note: state.note && { ...state.note, content },
        })),
      reset: () => set({ note: undefined }),
    })
  )
);
