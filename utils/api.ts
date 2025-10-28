const createURL = (path: string) => {
  //   window.location.origin always ive the url theat the app is running on,
  // the reason of using it is to avoid hardcoding the base url
  return window.location.origin + path;
};

export const createNewEntry = async () => {
  const response = await fetch(new Request(createURL("/api/journal")), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
