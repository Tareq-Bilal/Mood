import { JournalEntries, JournalAnalysis } from "@/db/schema";
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

const getJournalMood = async (entryId: string) => {
  const [analysis] = await db
    .select({
      mood: JournalAnalysis.mood,
      color: JournalAnalysis.color,
    })
    .from(JournalAnalysis)
    .where(eq(JournalAnalysis.entryId, entryId))
    .limit(1);

  return analysis || null;
};

const JournalPage = async () => {
  const entries = await getUserEntries();

  // Fetch mood data for all entries
  const entriesWithMoods = await Promise.all(
    entries.map(async (entry) => {
      const moodData = await getJournalMood(entry.id);
      return {
        ...entry,
        moodData,
      };
    })
  );

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center sm:px-2 md:px-5 lg:px-15 xl:px-47">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          Journal
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {entries.length} entries
        </p>
      </div>

      {/* Grid Container - Centered */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* New Entry Card */}
          <Link href="/journal/new">
            <NewJournal />
          </Link>

          {/* Journal Entries */}
          {entriesWithMoods.map((entry) => (
            <Link key={entry.id} href={`/journal/${entry.id}`}>
              <JournalEntry journalEntry={entry} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalPage;
