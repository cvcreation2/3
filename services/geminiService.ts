import { GoogleGenAI } from "@google/genai";
import { getSystemHealthReport } from './mockData';

const getClient = () => {
  const apiKey = process.env.API_KEY || ''; // Fallback to empty string if not set, handled by UI check
  return new GoogleGenAI({ apiKey });
};

export const analyzeSystemHealth = async (): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set your API Key in the environment.");
  }

  const ai = getClient();
  const systemData = getSystemHealthReport();
  
  const prompt = `
    You are a Senior DevOps Engineer for a VPN Service Provider. 
    Analyze the following system JSON status report. 
    Provide a professional, concise executive summary of the current infrastructure health.
    Highlight any critical issues, potential optimizations, and security recommendations.
    Format the output with Markdown.

    System Data:
    ${systemData}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "Failed to generate AI analysis. Please check your API key and connection.";
  }
};

export const askAiAssistant = async (question: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Please configure your API Key in the source code or environment variables to use AI features.";
    }
  
    const ai = getClient();
    const systemData = getSystemHealthReport();
    
    const prompt = `
      Context: VPN Admin Panel System Data: ${systemData}
      
      User Question: ${question}
      
      Answer as a helpful assistant. Keep it brief.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "I couldn't understand that.";
    } catch (error) {
      return "Error communicating with AI service.";
    }
  };