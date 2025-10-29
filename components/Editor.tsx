"use client";

import { useState, useEffect, useRef } from "react";
import { updateJournalEntry } from "@/utils/api";
import { Spinner } from "./ui/spinner";
import { CircleCheck, Brain } from "lucide-react";

const Editor = ({ entry }) => {
  const [entryContent, setEntryContent] = useState(entry.content);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Autosave effect
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't save if content hasn't changed
    if (entryContent === entry.content) {
      return;
    }

    // Set a new timeout to save after 1 second of no typing
    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await updateJournalEntry(entry.id, entryContent);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save:", error);
      } finally {
        setIsSaving(false);
      }
    }, 200); // 200ms debounce

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [entryContent, entry.id, entry.content]);

  return (
    <div className="w-full h-full  mr-260 px-4">
      {/* Save Status Indicator */}
      <div className="pt-4 ml-3 flex items-center justify-between">
        <div className="text-sm text-gray-400 ">
          {isSaving && (
            <span className="flex items-center gap-2">
              <Spinner className="text-indigo-500" />
              <Brain className="size-4 animate-pulse text-purple-400" />
              <span>Saving & Analyzing...</span>
            </span>
          )}
          {!isSaving && lastSaved && (
            <span className="text-[#A8EB12]">
              <CircleCheck className="inline-block size-4 mb-0.5" /> Saved at{" "}
              {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <textarea
        className="
         w-full h-[80vh] text-white
         bg-transparent p-4 outline-none resize-none transition-colors"
        value={entryContent}
        onChange={(e) => setEntryContent(e.target.value)}
        placeholder="Write about your day..."
      />
    </div>
  );
};

export default Editor;
