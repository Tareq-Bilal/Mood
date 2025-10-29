import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { JournalEntries, JournalAnalysis } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { and, eq } from "drizzle-orm";
import Analyze from "@/utils/ai";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getUserByClerkId();

  if (!user) {
    return NextResponse.json(
      { error: "User not authenticated." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params; // Await params for Next.js 15

    // getting the content from the request body
    const body = await req.json();
    const { content } = body;

    // Content can be empty string, but must be provided
    if (content === undefined || content === null) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    // Get existing entry to check if content changed
    const [existingEntry] = await db
      .select()
      .from(JournalEntries)
      .where(and(eq(JournalEntries.id, id), eq(JournalEntries.userId, user.id)))
      .limit(1);

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Journal entry not found or unauthorized." },
        { status: 404 }
      );
    }

    // Check if content actually changed
    const contentChanged = existingEntry.content !== content;

    // Update the journal entry
    const updatedEntry = await db
      .update(JournalEntries)
      .set({
        content,
        updatedAt: new Date(), // Update timestamp
      })
      .where(and(eq(JournalEntries.id, id), eq(JournalEntries.userId, user.id)))
      .returning();

    if (updatedEntry.length === 0) {
      return NextResponse.json(
        { error: "Journal entry not found or unauthorized." },
        { status: 404 }
      );
    }

    // Only run analysis if content changed
    let analysis = null;
    if (contentChanged && content.trim().length > 0) {
      try {
        console.log("Content changed, analyzing entry...");
        const analysisResult = await Analyze(content);

        // Check if analysis already exists
        const [existingAnalysis] = await db
          .select()
          .from(JournalAnalysis)
          .where(eq(JournalAnalysis.entryId, id))
          .limit(1);

        if (existingAnalysis) {
          // Update existing analysis
          const [updatedAnalysis] = await db
            .update(JournalAnalysis)
            .set({
              mood: analysisResult.mood,
              subject: analysisResult.subject,
              summary: analysisResult.summary,
              color: analysisResult.color,
              negative: analysisResult.negative,
              sentimentScore: analysisResult.sentimentScore,
              updatedAt: new Date(),
            })
            .where(eq(JournalAnalysis.entryId, id))
            .returning();
          analysis = updatedAnalysis;
        } else {
          // Create new analysis
          const [newAnalysis] = await db
            .insert(JournalAnalysis)
            .values({
              entryId: id,
              mood: analysisResult.mood,
              subject: analysisResult.subject,
              summary: analysisResult.summary,
              color: analysisResult.color,
              negative: analysisResult.negative,
              sentimentScore: analysisResult.sentimentScore,
            })
            .returning();
          analysis = newAnalysis;
        }

        console.log("Analysis saved successfully!");
      } catch (error) {
        console.error("Failed to analyze entry:", error);
        // Don't fail the request if analysis fails
      }
    }

    return NextResponse.json({
      updatedEntry: updatedEntry[0],
      analysis,
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry." },
      { status: 500 }
    );
  }
};
