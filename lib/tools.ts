import { google } from "@/app/api/chat/route";
import { db } from "@/db";
import { getSession } from "@/db/actions";
import { embeddingTable } from "@/db/schema/embedding";
import { noteTable } from "@/db/schema/note";
import { generateText, tool } from "ai";
import {
  and,
  cosineDistance,
  desc,
  eq,
  getTableColumns,
  gt,
  inArray,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { generateEmbedding } from "./embedding";

export const findRelatedNotes = tool({
  description: `Retrieve the user's notes (title, content, date) by calling this tool to help answer their question`,
  parameters: z.object({
    query: z
      .string()
      .describe(
        "a query refined and rephrased based on the user's question to find relevant notes"
      ),
  }),
  execute: async ({ query }) => {
    const [session, embedding] = await Promise.all([
      getSession(),
      generateEmbedding(query),
    ]);

    const similarity = sql<number>`1 - (${cosineDistance(
      embeddingTable.embedding,
      embedding
    )})`;

    const notes = await db
      .select({
        content: embeddingTable.content,
        title: noteTable.title,
        createdAt: noteTable.createdAt,
        similarity,
      })
      .from(embeddingTable)
      .where(
        and(eq(embeddingTable.userId, session.user.id), gt(similarity, 0.5))
      )
      .innerJoin(noteTable, eq(embeddingTable.noteId, noteTable.noteId))
      .orderBy((t) => desc(t.similarity))
      .limit(4);
    return notes;
  },
});

export const getNotes = tool({
  description:
    "Get the user's notes list including the total number of notes ordered by creation date, the result is limited to 10 notes, but you can use the offset to skip a number of notes",
  parameters: z.object({
    offset: z
      .number()
      .describe("The number of notes to skip (0 by default)")
      .optional(),
  }),
  execute: async ({ offset = 0 }) => {
    const session = await getSession();
    const { content, ...columns } = getTableColumns(noteTable);
    const notes = await db
      .select({
        ...columns,
        totalNotes: sql<number>`count(*) over ()`,
      })
      .from(noteTable)
      .where(eq(noteTable.userId, session.user.id))
      .orderBy(desc(noteTable.createdAt))
      .offset(offset)
      .limit(10);
    return {
      notes: notes.map((note) => ({
        ...note,
        title: note.title || "Untitled",
      })),
      totalNotes: notes?.[0].totalNotes ?? 0,
    };
  },
});

export const getNotesDetails = tool({
  description: `Get the details of the notes by calling this tool to help answer their question. The result is limited to 3 notes`,
  parameters: z.object({
    noteIds: z.array(z.number()).describe("The ids of the notes"),
  }),
  execute: async ({ noteIds }) => {
    const session = await getSession();
    const notes = await db
      .select()
      .from(noteTable)
      .where(
        and(
          eq(noteTable.userId, session.user.id),
          inArray(noteTable.noteId, noteIds.slice(0, 3))
        )
      )
      .limit(noteIds.length);
    return notes;
  },
});

export const generateNote = tool({
  description: `Generate a note based on the user's question. The generated content will be added to a new temporary note`,
  parameters: z.object({
    question: z.string().describe("The user's question or a detailed prompt"),
    title: z.string().describe("The title of the note"),
    emoji: z
      .string()
      .describe("The emoji of the note, if there's no relevant emoji use 📄"),
  }),
  execute: async ({ question, title, emoji }) => {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: question,
    });
    return { content: text, title, emoji };
  },
});
