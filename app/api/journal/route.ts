import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { JournalEntries } from "@/db/schema";
import { NextResponse } from "next/server";

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

    const entry = await db
      .insert(JournalEntries)
      .values({
        userId: user.id,
        content: content,
      })
      .returning();

    return NextResponse.json({ entry: entry[0] });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry." },
      { status: 500 }
    );
  }
};
