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
    console.log(error);
    // showError(error||"error in responsing")
  }
}
