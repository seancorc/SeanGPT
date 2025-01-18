import type { Config } from "drizzle-kit";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

export default {
  schema: "./lib/db/schema/*.ts",
  dialect: "sqlite",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: databaseUrl,
  }
} satisfies Config;