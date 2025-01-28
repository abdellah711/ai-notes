import { streamText, tool } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { findRelatedNotes } from "@/lib/embedding";

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

  const messages = data.messages.filter((message) => message.content !== "");

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: `You are a helpful assistant designed to assist the user with their notes. 
- Review the user's notes (by calling \`getRelevantNotes\`) to gather context and ensure your response aligns with their existing content. 
- If the user's question is directly related to any of their notes, incorporate relevant details from those notes to provide a tailored answer. 
- If the question does not relate to any of the notes, provide a general response to the user's inquiry.`,
    messages,
    tools: {
      getRelevantNotes: tool({
        description: `Retrieve the user's notes (title, content, date) by calling this tool to help answer their question`,
        parameters: z.object({
          question: z.string().describe("The user's question"),
        }),
        execute: async ({ question }) => findRelatedNotes(question),
      }),
    },
    maxSteps: 3,
  });
  return result.toDataStreamResponse();
};
