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

export const SentimentScores = pgTable("sentiment_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // Foreign key reference to JournalEntries
  journalEntryId: uuid("journal_entry_id")
    .notNull()
    .references(() => JournalEntries.id, { onDelete: "cascade" }),

  // Store the journal's updatedAt timestamp (not a FK, just data)
  journalUpdatedAt: timestamp("journal_updated_at").notNull(),

  // Store mood value (not a FK, just data copied from JournalAnalysis)
  mood: varchar("mood", { length: 100 }).notNull(),

  // Store color value (not a FK, just data copied from JournalAnalysis)
  color: varchar("color", { length: 7 }).notNull(),

  // The sentiment score
  score: integer("score").notNull(),
});

export const Bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  journalEntryId: uuid("journal_entry_id")
    .notNull()
    .references(() => JournalEntries.id, { onDelete: "cascade" }),
});
