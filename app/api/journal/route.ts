import { getUserByClerkId } from "@/utils/auth";
import { db } from "@/utils/db";
import { JournalEntries } from "@/db/schema";
import { NextResponse } from "next/server";
export const POST = async (request: Request) => {
  const user = await getUserByClerkId();
  const { content } = await request.json();

  if (!content || content.trim() === "") {
    return new Response(JSON.stringify({ error: "Content is required." }), {
      status: 400,
    });
  }

  const entry = await db
    .insert(JournalEntries)
    .values({
      userId: user.id,
      content: "Write about your day!",
    })
    .returning();

  return NextResponse.json({ entry: entry[0] });
};
