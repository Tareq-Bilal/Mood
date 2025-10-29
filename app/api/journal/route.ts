import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { JournalEntries, JournalAnalysis } from "@/db/schema";
import { NextResponse } from "next/server";
import Analyze from "@/utils/ai";

export const POST = async (request: Request) => {
  try {
    const user = await getUserByClerkId();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    let content = ""; // Empty content for new entries

    // Check if request has a body
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        const body = await request.json();
        if (body.content) {
          content = body.content;
        }
      } catch {
        // If JSON parsing fails, use empty content
      }
    }

    // Create the journal entry
    const [entry] = await db
      .insert(JournalEntries)
      .values({
        userId: user.id,
        content: content,
      })
      .returning();

    // Analyze and save analysis if content is not empty
    let analysis = null;
    if (content.trim().length > 0) {
      try {
        console.log("Analyzing new entry...");
        const analysisResult = await Analyze(content);

        // Create new analysis
        [analysis] = await db
          .insert(JournalAnalysis)
          .values({
            entryId: entry.id,
            mood: analysisResult.mood,
            subject: analysisResult.subject,
            summary: analysisResult.summary,
            color: analysisResult.color,
            negative: analysisResult.negative,
            sentimentScore: analysisResult.sentimentScore,
          })
          .returning();

        console.log("Analysis saved successfully for new entry:", analysis);
      } catch (error) {
        console.error("Failed to analyze new entry:", error);
        // Don't fail the whole request if analysis fails
      }
    }

    return NextResponse.json({
      entry: entry,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry." },
      { status: 500 }
    );
  }
};
