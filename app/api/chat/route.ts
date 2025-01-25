import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";

const messagesSchema = z.object({
  messages: z.array(
    z.object({
      content: z.string(),
      role: z.enum(["user", "assistant"]),
    })
  ),
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const POST = async (req: Request) => {
  const body = await req.json();
  const { success, error, data } = messagesSchema.safeParse(body);
  if (!success) {
    return new Response(JSON.stringify({ error }), { status: 400 });
  }

  const messages = data.messages;

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system: `you're a helpful assistant`,
    messages,
  });
  return result.toDataStreamResponse();
};
