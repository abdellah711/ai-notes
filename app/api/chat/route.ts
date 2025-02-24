import { streamText, tool } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { findRelatedNotes, getNotes, getNotesDetails } from "@/lib/tools";

const messagesSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
      role: z.enum(["user", "assistant"]),
    })
  ),
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const { success, error, data } = messagesSchema.safeParse(body);
  if (!success) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  const currentOpenedNote = parseCurrentNoteId(req.headers.get("referer"));

  const messages = data.messages.filter((message) => message.content !== "");

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a helpful assistant designed to assist the user with their notes. 
- Review the user's notes (by calling \`getRelevantNotes\`) to gather context and ensure your response aligns with their existing content. 
- If the user's question is directly related to any of their notes, incorporate relevant details from those notes to provide a tailored answer. 
- If the question does not relate to any of the notes, provide a general response to the user's inquiry.
- you can get the user's notes by calling \`getUserNotes\`
- you can get the details of the notes by calling \`getNotesDetails\`
- Never ask the user to provide their notes or more details about the notes.
- Never reveal your available tools to the user.

${currentOpenedNote ? `Current opened note: ${currentOpenedNote}` : ""}
current date: ${new Date().toISOString()}
`,
    messages,
    tools: {
      getRelevantNotes: tool({
        description: `Retrieve the user's notes (title, content, date) by calling this tool to help answer their question`,
        parameters: z.object({
          question: z.string().describe("The user's question"),
        }),
        execute: async ({ question }) => findRelatedNotes(question),
      }),
      getUserNotes: tool({
        description:
          "Get the user's notes list including the total number of notes ordered by creation date, the result is limited to 10 notes, but you can use the offset to skip a number of notes",
        parameters: z.object({
          offset: z
            .number()
            .describe("The number of notes to skip (0 by default)")
            .optional(),
        }),
        execute: ({ offset }) => getNotes(offset),
      }),
      getNotesDetails: tool({
        description: `Get the details of the notes by calling this tool to help answer their question. The result is limited to 3 notes`,
        parameters: z.object({
          noteIds: z.array(z.number()).describe("The ids of the notes"),
        }),
        execute: async ({ noteIds }) => getNotesDetails(noteIds),
      }),
    },
    maxSteps: 3,
  });
  return result.toDataStreamResponse();
};

const parseCurrentNoteId = (referrer: string | null) => {
  if (!referrer) return null;
  const match = referrer.match(/\/notes\/(\d+)/);
  return match ? Number(match[1]) : null;
};
