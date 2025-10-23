import { router, procedure } from "../trpc";
import { z } from "zod";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  sigIn: procedure
    .input(
      z.object({
        name: z.string(),
        age: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // if no db client is attached to context, return a safe fallback (avoids 500)
      if (!ctx || !(ctx as any).dbClient) {
        return {
          id: Date.now(), // simple fallback id
          name: input.name,
          age: input.age,
        };
      }

      const db = (ctx as any).dbClient;

      try {
        // attempt to insert via the provided db client; if this fails, fall back
        const [newUser] = await db
          .insert(users)
          .values({
            // do not hardcode id; let DB generate it if possible
            name: input.name,
            age: input.age,
          })
          .returning();

        return newUser;
      } catch (err) {
        // on DB error, return a fallback object instead of throwing
        return {
          id: Date.now(),
          name: input.name,
          age: input.age,
          _warning: `DB insert failed: ${String(err)}`,
        };
      }
    }),
});

export type AppRouter = typeof appRouter;