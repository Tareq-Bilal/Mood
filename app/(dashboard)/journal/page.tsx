import { JournalEntries, JournalAnalysis, Bookmarks } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import JournalEntry from "@/components/journal/journal-entry";
import NewJournal from "@/components/journal/new-journal";
import Link from "next/link";
import Question from "@/components/question";

const getUserEntries = async () => {
  const user = await getUserByClerkId();
  if (!user) return [];

  const entries = await db
    .select()
    .from(JournalEntries)
    .where(eq(JournalEntries.userId, user.id))
    .orderBy(desc(JournalEntries.updatedAt));

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

const getUserBookmarks = async (userId: string) => {
  const bookmarks = await db
    .select({
      journalEntryId: Bookmarks.journalEntryId,
    })
    .from(Bookmarks)
    .where(eq(Bookmarks.userId, userId));

  return new Set(bookmarks.map((b) => b.journalEntryId));
};

const JournalPage = async () => {
  const user = await getUserByClerkId();
  const entries = await getUserEntries();

  if (!user) {
    return <div>Please sign in to view your journal.</div>;
  }

  // Fetch bookmarks and mood data for all entries
  const bookmarkedIds = await getUserBookmarks(user.id);

  const entriesWithMoods = await Promise.all(
    entries.map(async (entry) => {
      const moodData = await getJournalMood(entry.id);
      return {
        ...entry,
        moodData,
      };
    })
  );

  const decoratedEntries = entriesWithMoods.map((entry, index) => ({
    ...entry,
    isRecent: index === 0,
    isBookmarked: bookmarkedIds.has(entry.id),
  }));

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center sm:px-2 md:px-5 lg:px-15 xl:px-47">
      {/* Header */}
      <div className="mt-4 mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
          Journal
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          {entries.length} entries
        </p>
      </div>

      {/* Grid Container - Centered */}
      <div className="w-full max-w-7xl">
        {/* Journal Question */}
        <div className="mb-12">
          <Question />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {/* New Entry Card */}
          <Link href="/journal/new">
            <NewJournal />
          </Link>

          {/* Journal Entries */}
          {decoratedEntries.map((entry) => (
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
