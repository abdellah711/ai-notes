import { Message } from "ai";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you?",
    role: "assistant",
  },
];

export const useChatHistoryStore = create(
  combine(
    {
      messages: INITIAL_MESSAGES,
    },
    (set) => ({
      setMessages: (messages: Message[]) => set({ messages }),
      clearMessages: () => set({ messages: INITIAL_MESSAGES }),
    })
  )
);
