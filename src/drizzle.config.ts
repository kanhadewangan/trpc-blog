  import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';

  export default defineConfig({
    out: './src/db/migrations',
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.url
    },
  });
