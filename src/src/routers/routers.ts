import { router, procedure } from "../trpc";
import { z } from "zod";
import { posts, users, categories, post_categories } from "../../db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { get } from "http";
import { id } from "zod/locales";


const db = drizzle(process.env.DATABASE_URL!);
export const appRouter = router({
  signup: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      try{
      const client = await db.insert(users).values({
        name:input.name,
        email:input.email,
        password:input.password,
        age:18,
      }).returning({ id: users.id });
      // `returning` typically yields an array of rows; pick the first row's id
      const firstRow = Array.isArray(client) ? client[0] : client;
      const newId = firstRow?.id ?? null;
      console.log("User created with ID:", newId);
      return newId;
    }catch(e){
        console.error("Error creating user:", e);
        return "Error creating user";
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
      try{
      const check = await db.select().from(users).where(eq(users.email, input.email)&& eq(users.password, input.password));
      console.log("Login attempt for email:", input.email, "Found user:", check);

      if (check) {
        return { success: true, email: input.email };
      } else {
        return { success: false, error: "Invalid email or password" };
      }
    } 
  catch(e){
      console.error("Error during login:", e);
      return { success: false, error: "Login failed due to server error" };
    }
    }),
     
    getuser: procedure.input(
      z.object({
        id: z.number(),
      })
    ).query(async ({ input }) => {
      try{
        const user = await db.select().from(users).where(eq(users.id, input.id));
        console.log("Fetched user:", user);
        return user;
      }catch(e){
        console.error("Error fetching user:", e);
        return "Error fetching user";
      }
    }),


    createBlogs : procedure.input(
      z.object({
        title: z.string().min(5),
        content: z.string().min(20),
        authorId: z.number(),
      })
    ).mutation(async ({ input }) => {
      try{
        const blog = await db.insert(posts).values({
          title: input.title,
          content: input.content,
          authorId: input.authorId,
          slug: input.title.toLowerCase().replace(/\s+/g, '-'),
          isPublished: false,
        });
        console.log("Blog created with ID:", blog);
        return blog;
      }catch(e){
        console.error("Error creating blog:", e);
        return "Error creating blog";
      }
    }),
    getBlogs: procedure.query(async () => { 
      try{
        const allBlogs = await db.select().from(posts).limit(5);
        console.log("Fetched blogs:", allBlogs);
        return allBlogs;
      }catch(e){
        console.error("Error fetching blogs:", e);
        return "Error fetching blogs";
      }
    }),
    updateBlogs: procedure.input(
      z.object({
        id: z.number(),
        title: z.string().min(5).optional(),
        content: z.string().min(20).optional(),
        isPublished: z.boolean().optional(),
      })
    ).mutation(async ({ input }) => {
      try{
        const updatedBlog = await db.update(posts).set({
          title: input.title,
          content: input.content,
          isPublished: input.isPublished,
        }).where(eq(posts.id, input.id));
        console.log("Blog updated with ID:", updatedBlog);
        return updatedBlog;
      }catch(e){
        console.error("Error updating blog:", e);
        return "Error updating blog";
      }
    }),
    deleteBlogs: procedure.input(
      z.object({
        id: z.number(),
      })
    ).mutation(async ({ input }) => {
      try{
        const deletedBlog = await db.delete(posts).where(eq(posts.id, input.id));
        console.log("Blog deleted with ID:", deletedBlog);
        return deletedBlog;
      }catch(e){
        console.error("Error deleting blog:", e);
        return "Error deleting blog";
      }
    }),
    getBlogById: procedure.input(
      z.object({
        id: z.number(),
      })
    ).query(async ({ input }) => {
      try{
        const blog = await db.select().from(posts).where(eq(posts.id, input.id));
        console.log("Fetched blog:", blog);
        return blog;
      }catch(e){
        console.error("Error fetching blog:", e);
        return "Error fetching blog";
      }
    }),
    getBlogsByAuthorId: procedure.input(
      z.object({
        authorId: z.number(),
      })
    ).query(async ({ input }) => {
      try{
        const blogs = await db.select().from(posts).where(eq(posts.authorId, input.authorId));
        console.log("Fetched blogs by author ID:", blogs);
        return blogs;
      }catch(e){
        console.error("Error fetching blogs by author ID:", e);
        return "Error fetching blogs by author ID";
      }
    }),
    createCategory: procedure.input(
      z.object({
        name: z.string().min(3),
        slug: z.string().min(3),
        description: z.string().optional(),
      })
    ).mutation(async ({ input }) => {
      try{
        const category = await db.insert(categories).values({
          name: input.name,
          slug: input.slug,
          description: input.description,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        console.log("Category created with ID:", category);
        return category;
      }catch(e){
        console.error("Error creating category:", e);
        return "Error creating category";
      }
    }),
    getCategories: procedure.query(async ({ ctx }) => {
      if (!ctx || !(ctx as any).dbClient) {
        return [];
      }
      const db = (ctx as any).dbClient;
      try {
        const result = await db.select().from(categories);
        return result;
      } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
      }
    }),

    addCategory: procedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx || !(ctx as any).dbClient) {
        return { success: false, error: "dbClient not found" };
      }
      const db = (ctx as any).dbClient;
      try {
        const inserted = await db
          .insert(categories)
          .values({
            name: input.name,
            slug: input.slug,
            description: input.description,
          })
          .returning();
        return { success: true, category: inserted[0] ?? inserted };
      } catch (err: any) {
        console.error("Error adding category:", err);
        return { success: false, error: String(err?.message ?? err) };
      }
    }),

  getBlogsByCategory: procedure
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx || !(ctx as any).dbClient) {
        return [];
      }
      const db = (ctx as any).dbClient;
      try {
        // join posts with post_categories to filter by category
        const result = await db
          .select({ id: posts.id, title: posts.title, content: posts.content, authorId: posts.authorId, slug: posts.slug, isPublished: posts.isPublished })
          .from(posts)
          .innerJoin(post_categories, eq(posts.id, post_categories.postId))
          .where(eq(post_categories.categoryId, input.categoryId));
        return result;
      } catch (err) {
        console.error("Error fetching blogs by category:", err);
        return [];
      }
    }),
});

export type AppRouter = typeof appRouter;