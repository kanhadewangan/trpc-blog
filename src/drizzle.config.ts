  import 'dotenv/config';
  import { defineConfig } from 'drizzle-kit';

  export default defineConfig({
    out: './src/db/migrations',
    schema: './db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgres://825ae35d56d29c8f00f018e3f0a75df4f0c05195c6155ba6d854133ac5dccde2:sk_SRv2ZIn0n927QiPmQK4l6@db.prisma.io:5432/postgres?sslmode=require",
    },
  });
