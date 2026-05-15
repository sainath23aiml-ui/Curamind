import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

const ai = getAI();

export const generateClinicalNote = async (prompt: string) => {
  if (!ai) return { content: prompt, recommendations: "AI core is offline. Please check your API key." };
  try {
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{
          text: `You are a clinical assistant for a neurodiversity support platform called CuraMind. 
          The user wants to write a clinical note about their child's sensory behavior. 
          Here is their brief input: "${prompt}"
          
          Please write a professional, empathetic, and clear clinical note. 
          Format the response as JSON with two fields:
          - content: The main observation note.
          - recommendations: Suggested support or follow-up actions.
          
          Keep it concise but informative.`
        }]
      }]
    });

    return JSON.parse(response.response.text());
  } catch (error) {
    console.error("Gemini Note Generation Error:", error);
    return {
      content: prompt,
      recommendations: "No AI recommendations available at this time."
    };
  }
};
