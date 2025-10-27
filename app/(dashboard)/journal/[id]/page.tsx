import React from "react";
import Editor from "@/components/Editor";
import { db } from "@/utils/db";
import { JournalEntries } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getUserByClerkId } from "@/utils/auth";

const getJournalEntryById = async (id: string) => {
  const user = await getUserByClerkId();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const [entry] = await db
    .select()
    .from(JournalEntries)
    .where(and(eq(JournalEntries.id, id), eq(JournalEntries.userId, user.id)));

  return entry;
};

const EditorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getJournalEntryById(id);

  if (!entry) {
    return (
      <div className="text-white text-center mt-10">
        <h1 className="text-2xl font-bold">Entry not found</h1>
        <p className="text-gray-400 mt-2">
          This journal entry does not exist or you don&apos;t have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <Editor entry={entry} />
    </div>
  );
};

export default EditorPage;
