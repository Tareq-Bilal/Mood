import { JournalEntries, JournalAnalysis, Bookmarks } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import JournalEntry from "@/components/journal/journal-entry";
import NewJournal from "@/components/journal/new-journal";
import Streak from "@/components/journal/streak";
import Link from "next/link";
import Question from "@/components/question";
import { computeStreak } from "@/lib/utils";

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
    <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between md:justify-center gap-6 py-8 relative">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            Journal
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 md:absolute md:right-0">
          <Streak streak={computeStreak(entries)} max={7} />
          <span className="text-sm">Streak</span>
        </div>
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
