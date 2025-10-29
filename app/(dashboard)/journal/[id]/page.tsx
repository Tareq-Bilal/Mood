import React from "react";
import Editor from "@/components/Editor";
import { db } from "@/utils/db";
import { JournalEntries, JournalAnalysis } from "@/db/schema";
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

const getJournalAnalysis = async (entryId: string) => {
  const [analysis] = await db
    .select()
    .from(JournalAnalysis)
    .where(eq(JournalAnalysis.entryId, entryId))
    .limit(1);

  return analysis;
};

const EditorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const entry = await getJournalEntryById(id);
  const analysis = await getJournalAnalysis(id);

  const analysisData = [
    { subject: "Subject", value: analysis?.subject || "Not analyzed yet" },
    { subject: "Mood", value: analysis?.mood || "Not analyzed yet" },
    { subject: "Summary", value: analysis?.summary || "Not analyzed yet" },
    { subject: "Negative", value: analysis?.negative ? "Yes" : "No" },
    {
      subject: "Sentiment Score",
      value: analysis?.sentimentScore?.toString() || "N/A",
    },
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
    <div className="text-white w-full h-screen grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-zinc-500 h-full">
        <h1
          className="text-2xl py-4 flex justify-center text-white font-semibold"
          style={{
            background: `linear-gradient(135deg, ${
              analysis?.color || "#6366f1"
            }, ${analysis?.color ? `${analysis.color}dd` : "#4f46e5"})`,
          }}
        >
          Analysis
        </h1>
        <ul>
          {analysisData.map((data, index) => (
            <li
              key={index}
              className="p-4 border-b flex justify-between items-start border-zinc-300"
            >
              <strong className="shrink-0 mr-2">{data.subject}:</strong>
              <p className="grow text-left">{data.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditorPage;
