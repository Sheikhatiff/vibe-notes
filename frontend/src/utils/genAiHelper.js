import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const model = "gemini-2.5-flash";

// The client gets the API key from the environment variable `VITE_GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function genAiNote(prompt) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `
You are an intelligent note creator inside a friendly note-taking app.

### Instructions:
- The user will provide a prompt describing what kind of note they want.
- Generate **only text content** — no images, no files, no markdown formatting for code blocks.
- If the user requests code, include it **as plain text** (indented properly, but no syntax highlighting).
- If the user says “short”, “brief”, or similar → make it concise.
- If the user says “long”, “detailed”, or similar → make it comprehensive.
- Keep the response natural, readable, and helpful.
- Do not add extra explanations beyond what the prompt implies.

### User Prompt:
${prompt}

### Your Task:
Create a note purely based on the above prompt, following the rules strictly.
`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Determine error message based on error type
    let errorMessage = "Unable to generate note with AI";

    if (error?.message?.includes("API key")) {
      errorMessage = "Gemini API is not configured";
    } else if (error?.message?.includes("quota")) {
      errorMessage = "Gemini API quota exceeded. Please try again later.";
    } else if (error?.message?.includes("permission")) {
      errorMessage = "Gemini API access denied. Check your API key.";
    } else if (error?.status === 429) {
      errorMessage = "Gemini API rate limit exceeded. Please try again later.";
    } else if (error?.status === 401 || error?.status === 403) {
      errorMessage =
        "Gemini API authentication failed. Please check your API key.";
    } else if (
      error?.message?.includes("network") ||
      error?.message?.includes("fetch")
    ) {
      errorMessage = "Network error. Please check your internet connection.";
    }

    // Return error object with message for caller to handle
    return {
      error: true,
      message: errorMessage,
      originalError: error,
    };
  }
}
