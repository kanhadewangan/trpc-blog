import { integer, pgTable, serial, text, boolean, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  age: integer("age").notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull().references(() => users.id),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  isPublished: boolean("is_published").notNull().default(false),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
});

export const post_categories = pgTable("post_categories", {
  postId: integer("post_id").notNull().references(() => posts.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
});