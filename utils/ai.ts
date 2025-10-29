import { GoogleGenAI } from "@google/genai";

const Analyze = async (prompt: string) => {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }

    console.log("Initializing Gemini AI...");

    // Create the client instance - gets API key from environment variable
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    console.log("Generating content...");

    // Generate content using the models API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    });

    console.log("Analysis successful!");
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed with error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error(
      `Failed to analyze content: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export default Analyze;
