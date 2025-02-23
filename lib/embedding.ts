"use server";
import { Note } from "@/db/schema/note";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from "ai";

export const generateEmbedding = async (value: string) => {
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const model = google.textEmbeddingModel("text-embedding-004");

  const { embedding } = await embed({
    model,
    value,
  });

  return embedding;
};

export const generateNoteEmbedding = async (
  note: Pick<Note, "title" | "content">
) => {
  return generateEmbedding(`Title: ${note.title}\n\nContent: ${note.content}`);
};
