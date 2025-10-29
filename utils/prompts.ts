export const journalPrompts = {
  analyzeEntry: {
    role: "You are a compassionate mood and emotion analyzer.",
    task: `Analyze the following journal entry and provide insights:
1. Detected mood/emotion
2. Key themes and patterns 
3. Brief summary
4. Sentiment (positive/negative/neutral)
5. Suggestions for reflection`,
    format:
      "Return as JSON with keys: mood, subject, summary, color (in hex) , negative",
  },

  generateSuggestion: {
    role: "You are a supportive journal coach.",
    task: "Generate one insightful reflection question based on this entry",
  },

  extractMood: {
    role: "You are a mood detection expert.",
    task: "Extract and classify the primary mood from this journal entry",
  },
};
