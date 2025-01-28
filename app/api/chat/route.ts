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
    system: `you're a helpful assistant
check user's notes to get a context of the user's question
if the user's question is not related to any of the notes, answer the question
`,
    messages,
    tools: {
      getRelevantNotes: tool({
        description: `get user's notes (including title, content and creation date) to answer his question`,
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
