# 📔 Mood - AI-Powered Journal Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)

**A modern, intelligent journaling application with real-time auto-saving and AI-powered mood analysis**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Documentation](#-documentation)

</div>

---

## 🌐 Live Application

Experience Mood in action:

**[https://mood-five-sigma.vercel.app/](https://mood-five-sigma.vercel.app/)**

> Click the link above to start journaling with AI-powered mood analysis!

---

## ✨ Features

### 🔄 **Real-Time Auto-Saving**

Write without worry! Your journal entries are automatically saved every 200ms after you stop typing.

- **Intelligent Debouncing** - Prevents excessive saves while typing
- **Optimistic Updates** - Instant UI feedback with save status indicators
- **Content Preservation** - Your text never gets lost, even during navigation
- **Visual Feedback** - Clear saving/saved status with timestamps

### 🤖 **AI-Powered Mood Analysis**

Powered by Google's Gemini AI, each entry is automatically analyzed to detect:

- **Mood Detection** - Identifies emotional state (Happy, Anxious, Calm, etc.)
- **Sentiment Scoring** - Quantifies positivity/negativity (-10 to +10 scale)
- **Subject Extraction** - Identifies the main topic of your entry
- **Smart Summaries** - Generates concise one-line summaries
- **Color Coding** - Each mood gets a unique color for visual tracking
- **Negativity Detection** - Flags entries with concerning emotional content

### 📝 **Seamless Entry Management**

Intuitive interface for creating and managing your journal entries:

- **Instant Creation** - Start writing immediately, entry saves on first keystroke
- **Grid View** - Beautiful card-based layout of all your entries
- **Quick Navigation** - Click any entry to open and edit
- **Entry Counter** - Track your journaling consistency
- **Mood Indicators** - Visual mood colors on each entry card

### 🔐 **Secure Authentication**

Built with Clerk for enterprise-grade security:

- **User Authentication** - Secure sign-up and sign-in
- **Protected Routes** - Middleware ensures only authenticated users access journals
- **User Isolation** - Each user's data is completely private and separated

### 🎨 **Modern UI/UX**

Clean, distraction-free writing experience:

- **Dark Theme** - Easy on the eyes for any time of day
- **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- **Minimalist Editor** - Focus on writing without clutter
- **Live Analysis Panel** - Real-time mood insights displayed alongside your entry
- **Smooth Animations** - Polished micro-interactions throughout

---

## 🛠️ Tech Stack

### **Frontend**

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router and Server Components
- **[React 19.2](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### **Backend & Database**

- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript-first ORM
- **[Neon PostgreSQL](https://neon.tech/)** - Serverless Postgres database
- **[Zod](https://zod.dev/)** - Schema validation for AI responses

### **AI & Analysis**

- **[Google Gemini AI](https://ai.google.dev/)** - Advanced language model for mood analysis
- **Custom Prompt Engineering** - Optimized prompts for accurate sentiment detection

### **Authentication**

- **[Clerk](https://clerk.com/)** - Complete user management and authentication

### **Development Tools**

- **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** - Database migrations
- **[ESLint](https://eslint.org/)** - Code quality
- **[PostCSS](https://postcss.org/)** - CSS processing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database (we recommend [Neon](https://neon.tech/))
- Clerk account for authentication
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tareq-Bilal/Mood.git
   cd mood
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL=your_neon_postgres_connection_string

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up the database**

   ```bash
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

<h1>Landing Page</h1>
<img width="1905" height="865" alt="Screenshot from 2025-10-29 18-53-53" src="https://github.com/user-attachments/assets/7f2eb129-6645-4877-9355-a7eba4de5883" />
<br>
<br>
<h1>Journal Listing</h1>
<img width="1905" height="860" alt="Screenshot from 2025-10-30 18-36-37" src="https://github.com/user-attachments/assets/2b24c872-4a52-4371-a24d-dc807411ac8e" />
<br>
<br>
<h1>Realtime Journal Analyzing</h1>
<img width="1905" height="865" alt="Screenshot from 2025-10-29 18-54-59" src="https://github.com/user-attachments/assets/dd0f5095-59af-4ac1-a4f3-64b99f03bef4" />
<br>
<br>
<h1>Auto Saving Feature</h1>
<img width="526" height="97" alt="Screenshot from 2025-10-29 18-53-10" src="https://github.com/user-attachments/assets/d82edfba-3414-4100-9adb-6697222a6786" />
<br>
<br>
<h1>Ask About Your Journals</h1>
<img width="1573" height="602" alt="Screenshot from 2025-10-30 17-45-23" src="https://github.com/user-attachments/assets/a6303cad-a993-4314-92f6-1c371c0a5b37" />
<br>
<br>
<h1>Journals Chart Aanalysis</h1>
<img width="1910" height="861" alt="Screenshot from 2025-10-30 16-49-10" src="https://github.com/user-attachments/assets/66aa5f11-7baf-4626-ab4a-3b0553d8f6e4" />
<br>

---

## 🏗️ Architecture

### **Application Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Journal List │  │ Editor Page  │  │ Analysis View│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     API Routes (Next.js)                     │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ POST /api/journal    │  │ PATCH /api/journal/  │         │
│  │ (Create Entry)       │  │ [id] (Update Entry)  │         │
│  └──────────────────────┘  └──────────────────────┘         │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┴──────────────┐
            │                              │
┌───────────▼───────────┐     ┌───────────▼────────────┐
│   Database (Neon)     │     │   Google Gemini AI     │
│  ┌─────────────────┐  │     │  ┌──────────────────┐  │
│  │ JournalEntries  │  │     │  │ Mood Analysis    │  │
│  │ JournalAnalysis │  │     │  │ Sentiment Score  │  │
│  │ Users           │  │     │  │ Subject Extract  │  │
│  └─────────────────┘  │     │  └──────────────────┘  │
└───────────────────────┘     └────────────────────────┘
```

### **Database Schema**

```sql
-- Users (managed by Clerk)
Users {
  id: UUID PRIMARY KEY
  clerkUserId: VARCHAR(255) UNIQUE
  email: VARCHAR(255)
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}

-- Journal Entries
JournalEntries {
  id: UUID PRIMARY KEY
  userId: UUID FOREIGN KEY -> Users.id
  content: TEXT
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}

-- AI Analysis Results
JournalAnalysis {
  id: UUID PRIMARY KEY
  entryId: UUID UNIQUE FOREIGN KEY -> JournalEntries.id ON DELETE CASCADE
  mood: VARCHAR(100)
  subject: VARCHAR(255)
  summary: TEXT
  color: VARCHAR(7)  -- Hex color code
  negative: BOOLEAN
  sentimentScore: INTEGER  -- Range: -10 to +10
  createdAt: TIMESTAMP
  updatedAt: TIMESTAMP
}
```

### **Key Components**

#### **Editor Component** (`components/Editor.tsx`)

The heart of the application, featuring:

- Real-time auto-save with 200ms debounce
- State management for new vs. existing entries
- Optimistic UI updates
- Smart content preservation during navigation

#### **AI Analysis** (`utils/ai.ts`)

Handles mood detection:

- Sends entry content to Gemini AI
- Validates response with Zod schema
- Returns structured analysis data
- Error handling for API failures

#### **API Routes**

- **POST `/api/journal`** - Creates new entries
- **PATCH `/api/journal/[id]`** - Updates entries and triggers AI analysis
- Automatic analysis on content changes
- Efficient database queries with Drizzle ORM

---

## 📖 Documentation

### **Auto-Save Behavior**

The auto-save feature intelligently decides when to save:

```typescript
Should Save When:
✓ New entry with content (first save creates the entry)
✓ Existing entry with changed content
✓ Not already saving

Skip Save When:
✗ New entry with empty content (no point creating empty entries)
✗ Existing entry with unchanged content
✗ Save operation already in progress
```

### **AI Analysis Trigger**

Analysis runs automatically but efficiently:

```typescript
Analysis Triggers:
✓ Entry content changes
✓ Content is not empty

Analysis Skips:
✗ Content unchanged since last analysis
✗ Empty content
✗ API key missing or invalid
```

### **State Management Strategy**

```typescript
Component State:
- entryContent: Current textarea value
- entryId: Database ID (null for new entries)
- hasCreated: Boolean flag to prevent re-creation
- isSaving: Visual feedback for save operation
- lastSaved: Timestamp for "Saved at..." message

Refs:
- timeoutRef: Manages debounce timeout
- isCreatingRef: Prevents duplicate creation calls
```

---

## 🎯 Use Cases

### **Personal Journaling**

- Daily reflections and thoughts
- Mood tracking over time
- Identifying emotional patterns

### **Mental Health Tracking**

- Monitor sentiment trends
- Flag negative emotional states
- Track progress in therapy

### **Creative Writing**

- Brainstorming and ideation
- Capturing fleeting thoughts
- Organizing narrative ideas

### **Professional Logging**

- Work reflections
- Project retrospectives
- Learning journal

---

## 🔮 Future Enhancements

- [ ] **Mood Trends Dashboard** - Visualize mood changes over time with charts
- [ ] **Export Functionality** - Download entries as PDF or Markdown
- [ ] **Search & Filter** - Find entries by mood, date, or keyword
- [ ] **Tags & Categories** - Organize entries with custom tags
- [ ] **Dark/Light Theme Toggle** - User preference for appearance
- [ ] **Offline Mode** - Queue saves when offline, sync when back online
- [ ] **Reminders** - Push notifications to encourage daily journaling
- [ ] **Multiple AI Models** - Choice between Gemini, GPT, or Claude
- [ ] **Voice Journaling** - Speech-to-text for hands-free entries
- [ ] **Shared Journals** - Collaborate with therapists or partners

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- AI powered by [Google Gemini](https://ai.google.dev/)
- Authentication by [Clerk](https://clerk.com/)
- Database by [Neon](https://neon.tech/)
- Icons by [Lucide](https://lucide.dev/)

---

## 📧 Contact

**Tareq Bilal** - [@Tareq-Bilal](https://github.com/Tareq-Bilal)

Project Link: [https://github.com/Tareq-Bilal/Mood](https://github.com/Tareq-Bilal/Mood)

---

<div align="center">

**Made with ❤️ and ☕ by Tareq Bilal**

⭐ Star this repository if you find it helpful!

</div>
