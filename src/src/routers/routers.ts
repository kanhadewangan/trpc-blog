import { router, procedure } from "../trpc";
import { email, z } from "zod";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  signIn: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(6),
        
      })
    )
    .mutation(async ({ input, ctx }) => {
      // if no db client is attached to context, return a safe fallback (avoids 500)
      if (!ctx || !(ctx as any).dbClient) {
        return {
          id: Date.now(), // simple fallback id
          name: input.name,
          email: input.email,
          password: input.password,
        };
      }      
    }),
    login: procedure.input(
      z.object({
        email: z.email(),
            password: z.string().min(6),
        })).mutation(async({input,ctx})=>{
            return {input};
        }),
        loginUser: procedure.query(()=>{
            return {message: "Login successful"};
        })
        
            
});

export type AppRouter = typeof appRouter;