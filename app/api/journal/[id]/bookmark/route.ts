import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { Bookmarks } from "@/db/schema";
import { getUserByClerkId } from "@/utils/auth";
import { eq, and } from "drizzle-orm";

/**
 * POST /api/journal/[id]/bookmark
 * Creates a bookmark for a journal entry
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: entryId } = await params;

    // Check if bookmark already exists
    const existingBookmark = await db
      .select()
      .from(Bookmarks)
      .where(
        and(
          eq(Bookmarks.userId, user.id),
          eq(Bookmarks.journalEntryId, entryId)
        )
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { message: "Already bookmarked", bookmark: existingBookmark[0] },
        { status: 200 }
      );
    }

    // Create bookmark
    const [bookmark] = await db
      .insert(Bookmarks)
      .values({
        userId: user.id,
        journalEntryId: entryId,
      })
      .returning();

    return NextResponse.json({ bookmark }, { status: 201 });
  } catch (error) {
    console.error("Error bookmarking entry:", error);
    return NextResponse.json(
      { error: "Failed to bookmark entry" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/journal/[id]/bookmark
 * Removes a bookmark from a journal entry
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserByClerkId();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: entryId } = await params;

    // Delete bookmark
    const result = await db
      .delete(Bookmarks)
      .where(
        and(
          eq(Bookmarks.userId, user.id),
          eq(Bookmarks.journalEntryId, entryId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}
