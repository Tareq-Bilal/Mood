# Mood Journal - Features Documentation

## Overview

This document explains the core features of the Mood Journal application:

1. **Auto-Saving** - Automatically save journal entries as users type
2. **Create New Journal** - Create new journal entries from scratch
3. **Analyzing** - AI-powered sentiment analysis and mood detection

---

## 1. AUTO-SAVING FEATURE

### Overview

Auto-save automatically persists journal entries to the database every 200ms after the user stops typing. This ensures no data is lost and analysis is continuously updated.

### Flow Diagram

```
User Types → Debounce (200ms) → Check if should save → Save to DB → Update UI
     ↑                                                      ↓
     └─────────────────────────────────────────────────────┘
```

### Key Files

- **`components/Editor.tsx`** - Main component handling auto-save logic
- **`app/api/journal/[id]/route.ts`** - PATCH endpoint for updates
- **`utils/api.ts`** - API client for save operations
- **`db/schema.ts`** - Database schema for JournalEntries and JournalAnalysis

### Methods & Functions

#### 1. **shouldSkipSave()** - Decision Logic

```typescript
Location: components/Editor.tsx (line ~78)
Purpose: Determines if save should be skipped

Conditions:
- Skip if: New entry AND content is empty
- Skip if: Existing entry AND content hasn't changed
- Otherwise: Save
```

#### 2. **updateEntry()** - Save Existing Entries

```typescript
Location: components/Editor.tsx (line ~97)
Flow:
  1. Get entryId from state or URL params
  2. Call updateJournalEntry(id, content)
  3. Update lastSaved timestamp
  4. Sync entryId state if empty
```

#### 3. **handleAutoSave()** - Main Save Handler

```typescript
Location: components/Editor.tsx (line ~110)
Flow:
  1. Set isSaving = true (show spinner)
  2. Check if new or existing entry
  3. Call createEntry() OR updateEntry()
  4. Catch and log errors
  5. Set isSaving = false (hide spinner)
```

#### 4. **useEffect Auto-Save Hook**

```typescript
Location: components/Editor.tsx (line ~120)
Flow:
  1. Clear existing timeout
  2. Check if should skip save
  3. Set 200ms debounce timeout
  4. On timeout: Call handleAutoSave()
  5. Cleanup: Clear timeout on unmount

Dependencies: [shouldSkipSave, handleAutoSave]
```

### API Endpoint Details

#### PATCH `/api/journal/[id]`

**Location:** `app/api/journal/[id]/route.ts`

**Flow:**

```
PATCH Request
    ↓
1. Authenticate user (getUserByClerkId)
    ↓
2. Get existing entry from DB
    ↓
3. Compare: Has content changed?
    ↓
4. Update entry in DB
    ↓
5. If content changed && not empty:
    ├─ Call Analyze(content)
    ├─ Check if analysis exists
    ├─ If exists: Update JournalAnalysis
    └─ If new: Create JournalAnalysis
    ↓
Return: { updatedEntry, analysis }
```

### Database Schema

```typescript
// In db/schema.ts
JournalEntries {
  id: UUID (PK)
  content: TEXT
  userId: UUID (FK)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### UI Feedback

- **Saving...** - Shows spinner while saving
- **Saved at HH:MM:SS** - Shows green checkmark with timestamp
- **Start writing...** - Welcome message for new entries

---

## 2. CREATE NEW JOURNAL FEATURE

### Overview

Users can create new journal entries from scratch without pre-populated content. The entry is created in the database only when the user starts typing (on first save).

### Flow Diagram

```
Click "+ New Entry"
    ↓
Navigate to /journal/new
    ↓
User sees empty Editor
    ↓
User starts typing
    ↓
First Auto-Save triggers
    ↓
Create entry in DB
    ↓
Redirect to /journal/{id}
    ↓
Continue editing & analyzing
```

### Key Files

- **`components/journal/new-journal.tsx`** - Button component
- **`app/(dashboard)/journal/new/page.tsx`** - New journal page layout
- **`components/Editor.tsx`** - Shared editor component
- **`app/api/journal/route.ts`** - POST endpoint for creation
- **`utils/api.ts`** - API client

### Methods & Functions

#### 1. **NewJournal Component - Navigate**

```typescript
Location: components/journal/new-journal.tsx

Function: handleOnCLick()
Action: router.push("/journal/new")
Purpose: Navigate to new journal page without creating entry yet
```

#### 2. **createEntry()** - Create in Database

```typescript
Location: components/Editor.tsx (line ~90)
Flow:
  1. Call createNewEntry(entryContent)
  2. API sends POST request with content
  3. Server creates entry in DB
  4. Returns: { entry: { id, content, userId, ... } }
  5. Set entryId = newEntry.id
  6. Set hasCreated = true
  7. Update lastSaved timestamp
  8. Call router.replace(`/journal/${newEntry.id}`)
```

#### 3. **isNewEntry()** - Check State

```typescript
Location: components/Editor.tsx (line ~68)
Returns: !entryId && !hasCreated

Purpose: Determine if this is a new entry (not yet created)
```

### API Endpoint Details

#### POST `/api/journal`

**Location:** `app/api/journal/route.ts`

**Flow:**

```
POST Request { content?: string }
    ↓
1. Authenticate user
    ↓
2. Get content from request body (or empty string)
    ↓
3. Insert into JournalEntries table
    {
      userId: user.id,
      content: content,
      createdAt: now(),
      updatedAt: now()
    }
    ↓
4. Return created entry with ID
    ↓
Return: { entry: { id, content, userId, ... } }
```

### State Management

**Initial State (on /journal/new):**

```typescript
entryId: null;
hasCreated: false;
entryContent: "";
```

**After First Save:**

```typescript
entryId: "uuid-123";
hasCreated: true;
entryContent: "user's text";
```

### Navigation Flow

```
/journal/new (entry=null)
    ↓
User types
    ↓
Auto-save creates entry
    ↓
router.replace("/journal/{id}")
    ↓
Server-side: Fetch entry from DB
    ↓
/journal/{id} (entry={id, content})
    ↓
Continue editing
```

---

## 3. ANALYZING FEATURE

### Overview

AI-powered analysis that detects mood, sentiment, subject, and emotional tone of each journal entry. Analysis is run during auto-save and stored in the database.

### Flow Diagram

```
Auto-Save triggers
    ↓
Check: Content changed?
    ↓
Yes → Call Analyze(content)
    ↓
Send to Gemini AI API
    ↓
Receive analysis JSON
    ↓
Validate with Zod schema
    ↓
Save/Update in JournalAnalysis table
    ↓
Return to client
    ↓
Update UI with mood color & info
```

### Key Files

- **`utils/ai.ts`** - AI analysis logic
- **`app/api/journal/[id]/route.ts`** - Triggers analysis on save
- **`db/schema.ts`** - JournalAnalysis table
- **`app/(dashboard)/journal/[id]/page.tsx`** - Display analysis
- **`utils/prompts.ts`** - AI prompt templates

### Analysis Schema

```typescript
Location: utils/ai.ts

PromptSchema {
  mood: string              // e.g., "Happy", "Anxious", "Neutral"
  subject: string           // e.g., "Work stress"
  summary: string           // e.g., "Had a productive day"
  color: string             // Hex color (#FF5733)
  negative: boolean         // true/false
  sentimentScore: number    // -10 to 10
}
```

### Methods & Functions

#### 1. **Analyze()** - Main Analysis Function

```typescript
Location: utils/ai.ts (line ~51)

Flow:
  1. Check GEMINI_API_KEY exists
  2. Initialize GoogleGenAI client
  3. Get prompt template from journalPrompts
  4. Build full prompt with format instructions
  5. Send to Gemini 2.0 Flash model
  6. Parse response as JSON
  7. Validate with PromptSchema using Zod
  8. Return: PromptSchemaType object

Parameters: entryContent (string)
Returns: PromptSchemaType (validated object)
Throws: Error if validation fails
```

#### 2. **getPrompt()** - Build Prompt

```typescript
Location: utils/ai.ts (line ~27)

Flow:
  1. Get prompt template from journalPrompts.analyzeEntry
  2. Build format instructions from schema
  3. Combine: role + task + format + content
  4. Return complete prompt string

Purpose: Create consistent prompt structure
```

### API Endpoint Integration

#### In PATCH `/api/journal/[id]`

```typescript
Location: app/api/journal/[id]/route.ts (line ~62)

Trigger: Only if content changed && content not empty

Flow:
  1. Call Analyze(content)
  2. Check if analysis exists for this entry
  3. If exists:
     └─ UPDATE JournalAnalysis SET {...}
  4. If new:
     └─ INSERT INTO JournalAnalysis VALUES {...}
  5. Return analysis in response

Data Saved:
  entryId, mood, subject, summary, color,
  negative, sentimentScore, updatedAt
```

### Database Schema

```typescript
// In db/schema.ts
JournalAnalysis {
  id: UUID (PK)
  entryId: UUID (FK, unique, cascade delete)
  mood: VARCHAR(100)
  subject: VARCHAR(255)
  summary: TEXT
  color: VARCHAR(7)           // Hex color
  negative: BOOLEAN
  sentimentScore: INTEGER     // -10 to 10
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### Display Flow

#### 1. **Fetch Analysis** - Server Side

```typescript
Location: app/(dashboard)/journal/[id]/page.tsx (line ~28)

Function: getJournalAnalysis(entryId)
Flow:
  1. Query JournalAnalysis by entryId
  2. Return analysis or null
```

#### 2. **Display Analysis** - Client Side

```typescript
Location: app/(dashboard)/journal/[id]/page.tsx (line ~45)

Shows:
  - Subject: analysis.subject
  - Mood: analysis.mood
  - Summary: analysis.summary
  - Negative: analysis.negative ? "Yes" : "No"
  - Sentiment Score: analysis.sentimentScore
  - Color: Background of header (analysis.color)
```

### Journal Entry Cards

```typescript
Location: components/journal/journal-entry.tsx

Shows:
  - Mood text from analysis
  - Color indicator (mood color)
  - Falls back to "No mood analyzed yet" & indigo

Function: getJournalMood(entryId)
  1. Fetch mood and color from JournalAnalysis
  2. Pass to JournalEntry component
  3. Display in footer with color dot
```

### Error Handling

**In Analyze():**

```typescript
- If no API key: Throw error
- If no response: Throw error
- If can't parse JSON: Throw error
- If Zod validation fails: Throw detailed error with field info
```

**In API Endpoint:**

```typescript
- If analysis fails: Log error but DON'T fail the save
- Continue with entry update
- Analysis errors are non-fatal
```

---

## Integration Flow - Complete User Journey

```
1. USER CLICKS "+ NEW ENTRY"
   └─ new-journal.tsx → handleOnClick()
   └─ router.push("/journal/new")

2. EDITOR PAGE LOADS
   └─ Editor component with entry=null
   └─ Shows empty textarea + welcome message

3. USER STARTS TYPING
   └─ entryContent state updates
   └─ 200ms debounce starts

4. AFTER 200MS OF NO TYPING
   └─ handleAutoSave() called
   └─ isNewEntry() returns true
   └─ createEntry() called

5. CREATING ENTRY
   └─ POST /api/journal { content }
   └─ Server creates entry in DB
   └─ Returns { entry: { id, ... } }

6. POST-CREATE
   └─ setEntryId(newEntry.id)
   └─ setHasCreated(true)
   └─ router.replace("/journal/{id}")

7. PAGE REDIRECTS
   └─ Server fetches entry & analysis
   └─ Displays populated Editor

8. USER CONTINUES EDITING
   └─ Text changes trigger debounce
   └─ 200ms timeout
   └─ handleAutoSave() called again

9. UPDATING ENTRY (2nd+ save)
   └─ isNewEntry() returns false
   └─ updateEntry() called
   └─ PATCH /api/journal/{id} { content }

10. IN API: SAVE & ANALYZE
    └─ Compare: Has content changed?
    └─ If yes:
       ├─ Update JournalEntries
       ├─ Call Analyze(content)
       ├─ Save analysis to JournalAnalysis
       └─ Return both
    └─ If no:
       └─ Skip analysis

11. UI FEEDBACK
    └─ "Saving & Analyzing..." spinner
    └─ When complete: "Saved at HH:MM:SS"
    └─ Analysis panel updates with mood

12. ANALYSIS DISPLAY
    └─ Mood: "Happy", "Anxious", etc.
    └─ Color: Dynamic mood color
    └─ Sentiment: -10 to 10 score
    └─ Summary: One-liner summary
```

---

## Performance Considerations

### Auto-Save

- **Debounce**: 200ms to prevent excessive saves
- **Skip logic**: Don't save if content unchanged
- **Database**: Only updated when needed

### Analysis

- **Conditional**: Only analyzes on content change
- **Non-blocking**: Errors don't fail the save
- **Async**: Doesn't block UI updates

### State Management

- **Minimal state**: Only track essentials
- **Memoized functions**: useCallback prevents re-renders
- **Optimized re-renders**: Only when dependencies change

---

## Environment Variables Required

```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=your_database_url
```

---

## Error Scenarios Handled

| Scenario               | Handling               | User Impact                     |
| ---------------------- | ---------------------- | ------------------------------- |
| API key missing        | Throw error in Analyze | Analysis shows error in console |
| Network error on save  | Catch & log            | User sees error message         |
| Invalid JSON from AI   | Catch & log            | Entry saved, analysis skipped   |
| Zod validation fails   | Show detailed error    | Analysis shows validation error |
| Content hasn't changed | Skip save entirely     | No API call, saves bandwidth    |
| Empty new entry        | Skip save              | No database entry created       |

---

## Testing Checklist

- [ ] Create new entry and verify it's saved after first keystroke
- [ ] Edit entry and verify only one record is updated
- [ ] Verify analysis appears after save
- [ ] Change content and verify analysis updates
- [ ] Don't change content and verify analysis doesn't re-analyze
- [ ] Check error handling with invalid content
- [ ] Verify offline behavior (network disconnect)
- [ ] Test with very long entries (>10,000 chars)
- [ ] Test rapid saves (typing fast)
- [ ] Test navigation after creating new entry

---

## Future Enhancements

1. **Batch Analysis** - Analyze multiple entries at once
2. **Offline Support** - Queue saves when offline
3. **Analysis History** - Track how mood changes over time
4. **Custom Prompts** - Allow users to customize analysis
5. **Export Analysis** - Download mood reports
6. **Scheduled Analysis** - Re-analyze entries after time period
