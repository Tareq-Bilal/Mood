import { JournalEntries } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import JournalEntry from "@/components/journal/journal-entry";
import NewJournal from "@/components/journal/new-journal";
import Link from "next/link";

const getUserEntries = async () => {
  const user = await getUserByClerkId();
  if (!user) return [];

  const entries = await db
    .select()
    .from(JournalEntries)
    .where(eq(JournalEntries.userId, user.id));

  return entries;
};

const JournalPage = async () => {
  const entries = await getUserEntries();

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2">
          Journal
        </h1>
        <p className="text-center text-gray-400 text-sm md:text-base">
          {entries.length} entries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-16 w-full max-w-7xl mx-auto px-4">
        <div>
          <NewJournal />
        </div>
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <JournalEntry journalEntry={entry} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JournalPage;
