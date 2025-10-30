import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { JournalEntries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { answerQuestion } from "@/utils/ai";

export const POST = async (request: Request) => {
  try {
    const user = await getUserByClerkId();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { question } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    // Fetch user's journal entries
    const entries = await db
      .select({ content: JournalEntries.content })
      .from(JournalEntries)
      .where(eq(JournalEntries.userId, user.id))
      .limit(50); // Limit to recent 50 entries to avoid token limits

    if (entries.length === 0) {
      return NextResponse.json({
        answer:
          "You don't have any journal entries yet. Start writing to ask questions about your journals!",
      });
    }

    // Get journal contents
    const journalContents = entries.map((entry) => entry.content);

    // Get AI answer
    const answer = await answerQuestion(question, journalContents);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error answering question:", error);
    return NextResponse.json(
      { error: "Failed to answer question. Please try again." },
      { status: 500 }
    );
  }
};
