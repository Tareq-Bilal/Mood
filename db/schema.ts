import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const Analysis = pgTable("analysis", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  entryId: uuid("entry_id")
    .unique()
    .references(() => JournalEntries.id, { onDelete: "cascade" }),

  mood: varchar("mood", { length: 100 }).notNull(),
  summary: text("summary").notNull(),
  color: varchar("color", { length: 7 }).notNull(),
  isNegative: boolean("is_negative").notNull(),
});
// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  journalEntries: many(JournalEntries),
}));

export const journalEntriesRelations = relations(JournalEntries, ({ one }) => ({
  user: one(users, {
    fields: [JournalEntries.userId],
    references: [users.id],
  }),
  analysis: one(Analysis),
}));

export const analysisRelations = relations(Analysis, ({ one }) => ({
  journalEntry: one(JournalEntries, {
    fields: [Analysis.entryId],
    references: [JournalEntries.id],
  }),
}));
