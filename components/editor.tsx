"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { createNewEntry, updateJournalEntry } from "@/utils/api";
import { Spinner } from "./ui/spinner";
import { CircleCheck, Brain } from "lucide-react";
import { HIGHLIGHT_COLOR } from "@/utils/constants";

interface EditorProps {
  entry?: {
    id: string;
    content: string;
  } | null;
}

// Separate component for save status
const SaveStatus = ({
  isSaving,
  lastSaved,
  showWelcomeMessage,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
  showWelcomeMessage: boolean;
}) => {
  if (isSaving) {
    return (
      <span className="flex items-center gap-2">
        <Spinner className="text-indigo-500" />
        <Brain className="size-4 animate-pulse text-purple-400" />
        <span>Saving & Analyzing...</span>
      </span>
    );
  }

  if (lastSaved) {
    return (
      <span style={{ color: HIGHLIGHT_COLOR }}>
        <CircleCheck className="inline-block size-4 mb-0.5" /> Saved at{" "}
        {lastSaved.toLocaleTimeString()}
      </span>
    );
  }

  if (showWelcomeMessage) {
    return (
      <span className="text-gray-500">
        Start writing to create your journal...
      </span>
    );
  }

  return null;
};

const Editor = ({ entry = null }: EditorProps) => {
  const params = useParams();
  const [entryContent, setEntryContent] = useState(entry?.content || "");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [entryId, setEntryId] = useState<string | null>(entry?.id || null);
  const [hasCreated, setHasCreated] = useState(!!entry);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCreatingRef = useRef(false); // Track if creation is in progress

  // Sync entryId when entry prop changes (after navigation)
  useEffect(() => {
    if (entry?.id && !entryId) {
      setEntryId(entry.id);
      setHasCreated(true);
    }
  }, [entry?.id, entryId]);

  // Helper functions for cleaner logic
  const isNewEntry = useCallback(
    () => !entryId && !hasCreated && !isCreatingRef.current,
    [entryId, hasCreated]
  );

  const isEmptyContent = useCallback(
    () => entryContent.trim().length === 0,
    [entryContent]
  );

  const hasContentChanged = useCallback(
    () => entry && entryContent !== entry.content,
    [entry, entryContent]
  );

  const shouldSkipSave = useCallback(() => {
    if (isNewEntry() && isEmptyContent()) return true;
    if (entry && !hasContentChanged()) return true;
    if (isCreatingRef.current) return true; // Skip if already creating
    return false;
  }, [isNewEntry, isEmptyContent, entry, hasContentChanged]);

  const createEntry = useCallback(async () => {
    if (isCreatingRef.current) return; // Prevent multiple creations

    isCreatingRef.current = true;
    try {
      const newEntry = await createNewEntry(entryContent);
      setEntryId(newEntry.id);
      setHasCreated(true);
      setLastSaved(new Date());
      // Use shallow navigation to update URL without re-mounting the component
      window.history.replaceState(null, "", `/journal/${newEntry.id}`);
    } finally {
      isCreatingRef.current = false;
    }
  }, [entryContent]);

  const updateEntry = useCallback(async () => {
    const idToUpdate = entryId || (params.id as string);
    if (!idToUpdate) return;

    await updateJournalEntry(idToUpdate, entryContent);
    setLastSaved(new Date());

    if (!entryId) {
      setEntryId(idToUpdate);
    }
  }, [entryId, params.id, entryContent]);

  const handleAutoSave = useCallback(async () => {
    try {
      setIsSaving(true);

      if (isNewEntry()) {
        await createEntry();
      } else {
        await updateEntry();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [isNewEntry, createEntry, updateEntry]);

  // Autosave effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (shouldSkipSave()) {
      return;
    }

    timeoutRef.current = setTimeout(handleAutoSave, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shouldSkipSave, handleAutoSave]);

  const showWelcomeMessage = isNewEntry() && isEmptyContent();

  return (
    <div className="w-full h-full mr-260 px-4">
      {/* Save Status Indicator */}
      <div className="pt-4 ml-3 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <SaveStatus
            isSaving={isSaving}
            lastSaved={lastSaved}
            showWelcomeMessage={showWelcomeMessage}
          />
        </div>
      </div>

      <textarea
        className="w-full h-[80vh] text-white bg-transparent p-4 outline-none resize-none transition-colors"
        value={entryContent}
        onChange={(e) => setEntryContent(e.target.value)}
        placeholder="Write about your day..."
        autoFocus={!entry}
      />
    </div>
  );
};

export default Editor;
