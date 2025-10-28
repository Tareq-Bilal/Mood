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
  const analysisData = [
    { subject: "Subject", value: "" },
    { subject: "Mood", value: "" },
    { subject: "Summary", value: "" },
    { subject: "Negative", value: false },
  ];

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
    <div className="text-white w-full h-full grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-indigo-500">
        <h1 className="bg-indigo-500 text-2xl py-4 flex justify-center">
          Analysis
        </h1>
        <ul>
          {analysisData.map((data, index) => (
            <li
              key={index}
              className="p-4 border-b flex justify-between border-indigo-300"
            >
              <strong>{data.subject}:</strong>
              <span>{data.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditorPage;
