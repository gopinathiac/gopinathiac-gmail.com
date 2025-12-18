
import { GoogleGenAI } from "@google/genai";

export const getAIAudit = async (password: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a professional cybersecurity risk assessment on this password candidate: "${password}". 
      Analyze common attack vectors like dictionary attacks, brute forcing time, and pattern predictability. 
      Provide a concise 3-sentence professional report. Do not include introductory text.`,
      config: {
        systemInstruction: "You are a world-class cybersecurity expert specializing in credential security and cryptanalysis.",
        temperature: 0.7,
      },
    });

    return response.text || "Unable to retrieve AI analysis.";
  } catch (error) {
    console.error("AI Audit Error:", error);
    return "Error connecting to AI Security Core. Please check your network.";
  }
};
