import { JournalEntries, JournalAnalysis, Bookmarks } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { eq, desc } from "drizzle-orm";
import JournalEntry from "@/components/journal/journal-entry";
import Link from "next/link";
import { BookmarkX, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Fetches all bookmarked journal entries for the current user
 * Joins with journal entries and analysis data
 */
const getUserBookmarkedEntries = async () => {
  const user = await getUserByClerkId();
  if (!user) return [];

  // Fetch all bookmarks for the user with journal entry data
  const bookmarkedEntries = await db
    .select({
      id: JournalEntries.id,
      content: JournalEntries.content,
      createdAt: JournalEntries.createdAt,
      updatedAt: JournalEntries.updatedAt,
      userId: JournalEntries.userId,
      bookmarkCreatedAt: Bookmarks.createdAt,
    })
    .from(Bookmarks)
    .innerJoin(JournalEntries, eq(Bookmarks.journalEntryId, JournalEntries.id))
    .where(eq(Bookmarks.userId, user.id))
    .orderBy(desc(Bookmarks.createdAt)); // Most recently bookmarked first

  return bookmarkedEntries;
};

/**
 * Fetches mood analysis for a specific journal entry
 */
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

const BookmarksPage = async () => {
  const bookmarkedEntries = await getUserBookmarkedEntries();

  // Fetch mood data for all bookmarked entries
  const entriesWithMoods = await Promise.all(
    bookmarkedEntries.map(async (entry) => {
      const moodData = await getJournalMood(entry.id);
      return {
        ...entry,
        moodData,
        isBookmarked: true, // All entries here are bookmarked
      };
    })
  );

  // Calculate stats
  const stats = {
    total: bookmarkedEntries.length,
    thisWeek: bookmarkedEntries.filter((entry) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(entry.bookmarkCreatedAt) > weekAgo;
    }).length,
    mostCommonMood:
      entriesWithMoods.length > 0
        ? entriesWithMoods
            .map((e) => e.moodData?.mood)
            .filter(Boolean)
            .reduce((acc, mood) => {
              acc[mood as string] = (acc[mood as string] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
        : {},
  };

  const topMood =
    Object.keys(stats.mostCommonMood).length > 0
      ? Object.entries(stats.mostCommonMood).reduce((a, b) =>
          a[1] > b[1] ? a : b
        )[0]
      : null;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start sm:px-2 md:px-5 lg:px-15 xl:px-47">
      {/* Header */}
      <div className="mt-8 mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
          <span>📌</span>
          <span>Bookmarks</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Your saved journal entries
        </p>
      </div>

      {/* Stats Cards */}
      {bookmarkedEntries.length > 0 && (
        <div className="w-full max-w-7xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Bookmarks */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Saved</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.total}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <span className="text-3xl">📚</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Week */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">This Week</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.thisWeek}
                    </p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Calendar className="text-green-400" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Mood */}
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Top Mood</p>
                    <p className="text-2xl font-bold text-white capitalize">
                      {topMood || "N/A"}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <TrendingUp className="text-yellow-400" size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="w-full max-w-7xl">
        {bookmarkedEntries.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="mb-6 opacity-50">
              <BookmarkX size={80} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-gray-300">
              No bookmarks yet
            </h2>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Start bookmarking your favorite journal entries to easily find
              them later. Click the bookmark icon on any entry to save it here.
            </p>
            <Link
              href="/journal"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
            >
              Go to Journal
            </Link>
          </div>
        ) : (
          /* Bookmarked Entries Grid */
          <div className="w-full max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-300">
                Saved Entries
              </h2>
              <span className="text-sm text-gray-500">
                {entriesWithMoods.length}{" "}
                {entriesWithMoods.length === 1 ? "entry" : "entries"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
              {entriesWithMoods.map((entry, index) => (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <JournalEntry journalEntry={entry} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
