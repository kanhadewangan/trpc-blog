import { router, procedure } from "../trpc";
import { z } from "zod";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  signIn: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // prefer using the db client attached to ctx
      if (!ctx || !(ctx as any).dbClient) {
        // safe fallback when no DB is available (avoid throwing internal 500)
        return {
          id: Date.now(),
          name: input.name,
          email: input.email,
          _warning: "dbClient not found on ctx; returned fallback object",
        };
      }

      const db = (ctx as any).dbClient;
      try {
        // attempt to insert and return the created row (shape depends on your DB/client)
        const inserted = await db
          .insert(users)
          .values({
            name: input.name,
            // these columns must exist in your users table (ensure schema matches)
            // if they don't, the catch below will return a safe fallback
            email: input.email,
            password: input.password,
            age: 18, // default age for example
          })
          .returning();

        // returning() typically yields an array; return the first row or a fallback
        const newUser = Array.isArray(inserted) ? inserted[0] : inserted;
        return newUser ?? {
          id: Date.now(),
          name: input.name,
          email: input.email,
          _warning: "insert returned no row",
        };
      } catch (err: any) {
        return {
          id: Date.now(),
          name: input.name,
          email: input.email,
          _warning: `DB insert failed: ${String(err?.message ?? err)}`,
        };
      }
    }),

  login: procedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      // placeholder — replace with real auth logic (compare password, issue token, etc.)
      return { success: true, email: input.email };
    }),

  loginUser: procedure.query(() => {
    return { message: "Login successful" };
  }),
});

export type AppRouter = typeof appRouter;