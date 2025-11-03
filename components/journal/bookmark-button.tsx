"use client";

import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import { bookmarkJournalEntry, removeBookmark } from "@/utils/api";
import { toast } from "sonner";

interface BookmarkButtonProps {
  journalEntryId: string;
  initialBookmarked: boolean;
  size?: number;
  className?: string;
}

/**
 * BookmarkButton - A reusable bookmark toggle button component
 *
 * Features:
 * - Optimistic UI updates for instant feedback
 * - Error handling with automatic rollback
 * - Toast notifications on successful bookmark
 * - Loading states with visual feedback
 *
 * @param journalEntryId - The ID of the journal entry to bookmark
 * @param initialBookmarked - Initial bookmark state
 * @param size - Icon size (default: 16)
 * @param className - Additional CSS classes
 */
const BookmarkButton = ({
  journalEntryId,
  initialBookmarked,
  size = 16,
  className = "",
}: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent parent element navigation
    e.stopPropagation(); // Stop event bubbling

    // Optimistic update - instant UI feedback
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    try {
      if (previousState) {
        // Remove bookmark - silent operation
        await removeBookmark(journalEntryId);
      } else {
        // Add bookmark - show success toast
        await bookmarkJournalEntry(journalEntryId);
        toast.success("Journal added to bookmarks", {
          duration: 2000,
        });
      }
    } catch (error) {
      // Rollback on error and show error toast
      console.error("Failed to toggle bookmark:", error);
      setIsBookmarked(previousState);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`transition-colors ${
        isLoading ? "cursor-wait opacity-50" : "cursor-pointer"
      } ${
        isBookmarked
          ? "text-yellow-400 fill-yellow-400"
          : "text-gray-400 hover:text-yellow-400"
      } ${className}`}
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
    >
      <Bookmark size={size} fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
};

export default BookmarkButton;
