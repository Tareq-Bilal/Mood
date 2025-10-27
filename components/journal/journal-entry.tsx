import React from "react";
import { Separator } from "@/components/ui/separator";
import { Link } from "lucide-react";
import { truncateContent } from "@/lib/utils";
const JournalEntry = ({ journalEntry }) => {
  // Format the date
  const date = new Date(journalEntry.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Truncate content to preview

  return (
    <div className="w-full h-full min-h-64 bg-zinc-800 rounded-sm p-6 flex flex-col justify-between cursor-pointer hover:bg-zinc-700 hover:shadow-lg transition-all duration-200 border border-zinc-700 hover:border-indigo-600">
      {/* Date Header */}
      <div>
        <span className="text-sm font-semibold text-indigo-400">
          {formattedDate}
        </span>
        <Separator className="my-3 bg-zinc-600" />
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-sm md:text-base text-gray-300 line-clamp-6 leading-relaxed">
          {truncateContent(journalEntry.content)}
        </p>
      </div>

      {/* Mood Footer */}
      <div>
        <Separator className="mb-3 bg-zinc-600" />
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm font-medium text-gray-400">
            {truncateContent(journalEntry.mood || "No mood set")}
          </span>
          <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
