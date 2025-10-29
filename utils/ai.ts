import { GoogleGenAI } from "@google/genai";
import { journalPrompts } from "./prompts";
import z from "zod";

const PromptSchema = z.object({
  mood: z
    .string()
    .describe("the mood of the person who wrote the journal entry"),
  subject: z.string().describe("the subject of the journal entry"),
  summary: z.string().describe("quick summary of the journal entry"),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/)
    .describe("Color (in hex) representing the mood"),
  negative: z.boolean().describe("is the journal entry negative? true/false"),
  sentimentScore: z
    .number()
    .min(-10)
    .max(10)
    .describe(
      "Sentiment of the text and rated on a scale of -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive"
    ),
});

type PromptSchemaType = z.infer<typeof PromptSchema>;

const getPrompt = (content: string): string => {
  const promptTemplate = journalPrompts.analyzeEntry;

  // Build format instructions from schema
  const formatInstructions = `Return a JSON object with the following structure:
{
  "mood": "string - the mood of the person who wrote the journal entry",
  "subject": "string - the subject of the journal entry",
  "summary": "string - quick summary of the journal entry",
  "color": "string - hex color code (e.g., #FF5733) representing the mood",
  "negative": "boolean - is the journal entry negative? true/false",
  "sentimentScore": "number - sentiment score from -10 (extremely negative) to 10 (extremely positive)"
}`;

  const prompt = `${promptTemplate.role}

${promptTemplate.task}

Format Instructions:
${formatInstructions}

IMPORTANT: Respond ONLY with valid JSON matching the exact structure above. Do not include any other text.

Journal Entry:
"${content}"`;

  return prompt;
};

const Analyze = async (entryContent: string): Promise<PromptSchemaType> => {
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

    console.log("Generating analysis...");

    // Use the getPrompt function to build the full prompt
    const fullPrompt = getPrompt(entryContent);

    // Generate content using the models API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: fullPrompt,
    });

    console.log("Analysis successful!");

    // Parse the response as JSON
    const analysisText = response.text;

    if (!analysisText) {
      throw new Error("No response text received from AI");
    }

    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not find JSON in response");
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Validate the response against the schema
    const validatedData = PromptSchema.parse(parsedData);

    console.log("Data validated successfully!");
    return validatedData;
  } catch (error) {
    console.error("AI Analysis failed with error:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error)
    );

    // If it's a Zod validation error, provide more details
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.issues);
      throw new Error(
        `Failed to validate AI response: ${error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`
      );
    }

    throw new Error(
      `Failed to analyze content: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export default Analyze;
