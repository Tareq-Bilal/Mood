import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
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

export const JournalAnalysis = pgTable("journal_analysis", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  entryId: uuid("entry_id")
    .notNull()
    .unique()
    .references(() => JournalEntries.id, { onDelete: "cascade" }),

  mood: varchar("mood", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  negative: boolean("negative").notNull(),
  sentimentScore: integer("sentiment_score").notNull(),
});
