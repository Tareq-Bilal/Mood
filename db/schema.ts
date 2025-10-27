import { datetime } from "drizzle-orm/mysql-core";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id")
    .defaultRandom() // generates a random UUID automatically
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  clerkId: varchar("clerk_id").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});

export const JournalEntries = pgTable("journal_entries", {
  id: uuid("id")
    .defaultRandom() // generates a random UUID automatically
    .primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  content: text("content").notNull(),
  userId: uuid("user_id").notNull(),
});
