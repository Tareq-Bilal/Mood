import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { JournalEntries } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { and, eq } from "drizzle-orm";

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

    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ updatedEntry: updatedEntry[0] });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry." },
      { status: 500 }
    );
  }
};
