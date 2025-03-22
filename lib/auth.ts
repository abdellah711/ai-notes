import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema/auth";
import { noteTable } from "@/db/schema/note";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.newSession?.user) {
        await db.insert(noteTable).values({
          title: "Knowledge",
          emoji: "🧠",
          userId: ctx.context.newSession.user.id,
          isKnowledgeNote: true,
        });
      }
    }),
  },
});
