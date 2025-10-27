import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema"; // your Drizzle schema

// Ensure a single instance in development (like Prisma)
const globalForDrizzle = globalThis as unknown as {
  drizzleClient: ReturnType<typeof drizzle> | undefined;
};

export const db =
  globalForDrizzle.drizzleClient ??
  drizzle(
    new Pool({
      connectionString: process.env.DATABASE_URL!,
    }),
    { schema }
  );

// Keep the same client in dev mode to avoid reconnects
if (process.env.NODE_ENV !== "production") {
  globalForDrizzle.drizzleClient = db;
}
