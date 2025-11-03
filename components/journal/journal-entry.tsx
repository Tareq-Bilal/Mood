"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn, truncateContent } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { bookmarkJournalEntry, removeBookmark } from "@/utils/api";
import {
  HIGHLIGHT_COLOR,
  HIGHLIGHT_COLOR_ALPHA,
  PRIMARY_COLOR,
} from "@/utils/constants";

interface JournalEntryMoodData {
  mood: string | null;
  color: string | null;
}

interface JournalEntryData {
  id: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  moodData?: JournalEntryMoodData | null;
  isRecent?: boolean;
  isBookmarked?: boolean;
}

interface JournalEntryProps {
  journalEntry: JournalEntryData;
}

const JournalEntry = ({ journalEntry }: JournalEntryProps) => {
  // Local state for bookmark - allows optimistic UI updates
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(journalEntry.isBookmarked)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Format the date
  const date = new Date(journalEntry.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const isRecent = Boolean(journalEntry.isRecent);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking bookmark
    e.stopPropagation();

    // Optimistic update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    try {
      if (previousState) {
        await removeBookmark(journalEntry.id);
      } else {
        await bookmarkJournalEntry(journalEntry.id);
      }
    } catch (error) {
      // Rollback on error
      console.error("Failed to toggle bookmark:", error);
      setIsBookmarked(previousState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "w-full h-full min-h-64 bg-zinc-800 rounded-sm p-6 flex flex-col justify-between cursor-pointer hover:bg-zinc-700 transition-all duration-200 border",
        isRecent
          ? `border-[${HIGHLIGHT_COLOR_ALPHA}] hover:shadow-[0_0_20px_-10px_${HIGHLIGHT_COLOR}]`
          : "border-zinc-700 hover:shadow-lg hover:border-indigo-600"
      )}
      style={
        isRecent
          ? {
              boxShadow: `0 0 35px -12px ${HIGHLIGHT_COLOR}`,
            }
          : undefined
      }
    >
      {/* Date Header */}
      <div className="flex justify-between">
        <span className="text-sm font-semibold text-indigo-400">
          {formattedDate}
        </span>
        <button
          className={`transition-colors ${
            isLoading ? "cursor-wait opacity-50" : "cursor-pointer"
          } ${
            isBookmarked
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-400 hover:text-yellow-400"
          }`}
          onClick={handleBookmarkToggle}
          disabled={isLoading}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Separator */}
      <div>
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
            {journalEntry.moodData?.mood || "No mood analyzed yet"}
          </span>
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: journalEntry.moodData?.color || PRIMARY_COLOR,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
