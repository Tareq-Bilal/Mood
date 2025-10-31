import { db } from "@/utils/db";
import { SentimentScores, JournalEntries } from "@/db/schema";
import { eq, avg, and, gte } from "drizzle-orm";

/**
 * Saves sentiment score record when journal entry is created or updated
 * @param entryId - Journal entry ID
 * @param journalUpdatedAt - Updated timestamp from journal entry
 * @param analysisResult - AI analysis result containing mood, color, sentiment score
 */
export const saveSentimentScore = async (
  entryId: string,
  journalUpdatedAt: Date,
  analysisResult: {
    mood: string;
    color: string;
    sentimentScore: number;
  }
) => {
  try {
    const [sentimentScore] = await db
      .insert(SentimentScores)
      .values({
        journalEntryId: entryId,
        journalUpdatedAt,
        mood: analysisResult.mood,
        color: analysisResult.color,
        score: analysisResult.sentimentScore,
      })
      .returning();

    console.log("Sentiment score saved successfully:", sentimentScore);
    return sentimentScore;
  } catch (error) {
    console.error("Failed to save sentiment score:", error);
    throw error;
  }
};

/**
 * Updates sentiment score record when journal entry is updated
 * @param entryId - Journal entry ID
 * @param journalUpdatedAt - Updated timestamp from journal entry
 * @param analysisResult - New AI analysis result
 */
export const updateSentimentScore = async (
  entryId: string,
  journalUpdatedAt: Date,
  analysisResult: {
    mood: string;
    color: string;
    sentimentScore: number;
  }
) => {
  try {
    const [sentimentScore] = await db
      .update(SentimentScores)
      .set({
        journalUpdatedAt,
        mood: analysisResult.mood,
        color: analysisResult.color,
        score: analysisResult.sentimentScore,
        updatedAt: new Date(),
      })
      .where(eq(SentimentScores.journalEntryId, entryId))
      .returning();

    console.log("Sentiment score updated successfully:", sentimentScore);
    return sentimentScore;
  } catch (error) {
    console.error("Failed to update sentiment score:", error);
    throw error;
  }
};

/**
 * Gets sentiment score for a journal entry
 * @param entryId - Journal entry ID
 */
export const getSentimentScore = async (entryId: string) => {
  try {
    const [sentimentScore] = await db
      .select()
      .from(SentimentScores)
      .where(eq(SentimentScores.journalEntryId, entryId))
      .limit(1);

    return sentimentScore || null;
  } catch (error) {
    console.error("Failed to get sentiment score:", error);
    return null;
  }
};

/**
 * Gets all sentiment scores for a journal entry (historical tracking)
 * @param entryId - Journal entry ID
 */
export const getSentimentScores = async (entryId: string) => {
  try {
    const scores = await db
      .select()
      .from(SentimentScores)
      .where(eq(SentimentScores.journalEntryId, entryId))
      .orderBy(SentimentScores.createdAt);

    return scores;
  } catch (error) {
    console.error("Failed to get sentiment scores:", error);
    return [];
  }
};

/**
 * Gets all sentiment scores for a user's journal entries (for charts/history)
 * @param userId - User ID to filter scores
 * @param daysBack - Optional: Get scores for last N days
 */
export const getAllSentimentScores = async (
  userId: string,
  daysBack?: number
) => {
  try {
    const conditions = [eq(JournalEntries.userId, userId)];

    if (daysBack) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysBack);
      conditions.push(gte(SentimentScores.createdAt, dateThreshold));
    }

    const scores = await db
      .select({
        id: SentimentScores.id,
        createdAt: SentimentScores.createdAt,
        updatedAt: SentimentScores.updatedAt,
        journalEntryId: SentimentScores.journalEntryId,
        journalUpdatedAt: SentimentScores.journalUpdatedAt,
        mood: SentimentScores.mood,
        color: SentimentScores.color,
        score: SentimentScores.score,
      })
      .from(SentimentScores)
      .innerJoin(
        JournalEntries,
        eq(SentimentScores.journalEntryId, JournalEntries.id)
      )
      .where(and(...conditions))
      .orderBy(SentimentScores.createdAt);

    return scores;
  } catch (error) {
    console.error("Failed to get all sentiment scores:", error);
    return [];
  }
};

/**
 * Calculates the average sentiment score for a user's entries
 * @param userId - User ID
 * @param daysBack - Optional: Calculate average for last N days (default: all time)
 */
export const getAvgSentimentScores = async (
  userId: string,
  daysBack?: number
) => {
  try {
    // Build conditions
    const conditions = [];

    if (daysBack) {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysBack);
      conditions.push(gte(SentimentScores.createdAt, dateThreshold));
    }

    // Execute query with optional date filter
    const [result] = await db
      .select({
        averageScore: avg(SentimentScores.score),
      })
      .from(SentimentScores)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Convert string to number and round to 2 decimal places
    const averageScore = result?.averageScore
      ? parseFloat(Number(result.averageScore).toFixed(2))
      : null;

    console.log(`Average sentiment score: ${averageScore}`);
    return averageScore;
  } catch (error) {
    console.error("Failed to calculate average sentiment score:", error);
    return null;
  }
};

/**
 * Gets sentiment score statistics for a user
 * @param userId - User ID
 */
export const getSentimentStats = async (userId: string) => {
  try {
    const scores = await db
      .select({
        score: SentimentScores.score,
        mood: SentimentScores.mood,
        createdAt: SentimentScores.createdAt,
      })
      .from(SentimentScores)
      .where(eq(SentimentScores.journalEntryId, userId))
      .orderBy(SentimentScores.createdAt);

    if (scores.length === 0) {
      return {
        total: 0,
        average: null,
        highest: null,
        lowest: null,
        mostCommonMood: null,
      };
    }

    // Calculate statistics
    const scoreValues = scores.map((s) => s.score);
    const total = scoreValues.length;
    const sum = scoreValues.reduce((acc, val) => acc + val, 0);
    const average = parseFloat((sum / total).toFixed(2));
    const highest = Math.max(...scoreValues);
    const lowest = Math.min(...scoreValues);

    // Find most common mood
    const moodCounts = scores.reduce((acc, s) => {
      acc[s.mood] = (acc[s.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    return {
      total,
      average,
      highest,
      lowest,
      mostCommonMood,
    };
  } catch (error) {
    console.error("Failed to get sentiment statistics:", error);
    return {
      total: 0,
      average: null,
      highest: null,
      lowest: null,
      mostCommonMood: null,
    };
  }
};
