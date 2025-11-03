"use client";

import React, { useState, useCallback } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { bookmarkJournalEntry, removeBookmark } from "@/utils/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

const TOAST_DURATION = 3000;
const DEBOUNCE_DELAY = 300;

interface BookmarkButtonProps {
  journalEntryId: string;
  initialBookmarked: boolean;
  size?: number;
  className?: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

/**
 * BookmarkButton - A reusable, production-ready bookmark toggle component
 *
 * Features:
 * - Optimistic UI updates with instant feedback
 * - Debounced API calls to prevent race conditions
 * - Comprehensive error handling with rollback
 * - Toast notifications with custom icons
 * - Loading states with spinner animation
 * - Full keyboard accessibility
 * - Smooth animations with Framer Motion
 *
 * @example
 * <BookmarkButton
 *   journalEntryId="123"
 *   initialBookmarked={false}
 *   onBookmarkChange={(bookmarked) => console.log(bookmarked)}
 * />
 */
const BookmarkButton = ({
  journalEntryId,
  initialBookmarked,
  size = 16,
  className = "",
  onBookmarkChange,
}: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced API call to prevent rapid-fire requests
  const debouncedToggle = useCallback(
    debounce(async (previousState: boolean, entryId: string) => {
      try {
        if (previousState) {
          await removeBookmark(entryId);
          toast.success("Bookmark removed", {
            icon: <Check className="h-5 w-5" />,
            duration: TOAST_DURATION,
          });
        } else {
          await bookmarkJournalEntry(entryId);
          toast.success("Journal added to bookmarks", {
            icon: <Check className="h-5 w-5" />,
            duration: TOAST_DURATION,
          });
        }

        // Notify parent component
        onBookmarkChange?.(!previousState);
      } catch (error) {
        // Rollback on error
        console.error("Failed to toggle bookmark:", error);
        setIsBookmarked(previousState);

        toast.error("Failed to update bookmark", {
          description: "Please try again",
          duration: TOAST_DURATION,
        });
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY),
    [onBookmarkChange]
  );

  const handleBookmarkToggle = async (
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return; // Prevent multiple clicks

    // Optimistic update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setIsLoading(true);

    // Trigger debounced API call
    debouncedToggle(previousState, journalEntryId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleBookmarkToggle(e);
    }
  };

  return (
    <motion.button
      className={cn(
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-zinc-800 rounded-sm p-1",
        isLoading && "cursor-wait opacity-50",
        !isLoading && "cursor-pointer",
        isBookmarked
          ? "text-yellow-400"
          : "text-gray-400 hover:text-yellow-400",
        className
      )}
      onClick={handleBookmarkToggle}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      aria-pressed={isBookmarked}
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      whileTap={{ scale: isLoading ? 1 : 0.9 }}
      animate={{
        scale: isBookmarked && !isLoading ? [1, 1.15, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <Bookmark
          size={size}
          fill={isBookmarked ? "currentColor" : "none"}
          className="transition-all"
        />
      )}
    </motion.button>
  );
};

export default BookmarkButton;
