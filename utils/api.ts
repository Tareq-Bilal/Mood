const createURL = (path: string) => {
  //   window.location.origin always ive the url theat the app is running on,
  // the reason of using it is to avoid hardcoding the base url
  return window.location.origin + path;
};

export const createNewEntry = async (content?: string) => {
  const response = await fetch(new Request(createURL("/api/journal")), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: content ? JSON.stringify({ content }) : undefined,
  });

  if (!response.ok) {
    throw new Error("Failed to create journal entry");
  }

  const entry = await response.json();
  return entry.entry;
};

export const updateJournalEntry = async (id: string, content: string) => {
  const response = await fetch(new Request(createURL(`/api/journal/${id}`)), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to update journal entry");
  }

  const updatedEntry = await response.json();
  return updatedEntry.updatedEntry;
};

export const deleteJournalEntry = async (id: string) => {
  const response = await fetch(new Request(createURL(`/api/journal/${id}`)), {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete journal entry");
  }

  return true;
};

export const bookmarkJournalEntry = async (journalEntryId: string) => {
  const response = await fetch(
    new Request(createURL(`/api/journal/${journalEntryId}/bookmark`)),
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to bookmark journal entry");
  }

  const result = await response.json();
  return result.bookmark;
};

export const removeBookmark = async (journalEntryId: string) => {
  const response = await fetch(
    new Request(createURL(`/api/journal/${journalEntryId}/bookmark`)),
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove bookmark");
  }

  return true;
};
