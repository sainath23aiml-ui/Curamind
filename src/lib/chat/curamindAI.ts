/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialize AI to avoid crashing if key is missing
const getAI = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'undefined') return null;
  try {
    return new GoogleGenerativeAI(key);
  } catch (e) {
    return null;
  }
};

const ai = getAI();

export const CURAMIND_SYSTEM_INSTRUCTION = `
You are CuraMind, a warm and reliable AI companion for parents of neurodivergent children. 
Your personality: Empathetic, calm, and deeply rooted in the "Brain Board" of the child.

CORE IDENTITY:
- You are not just a chatbot; you are a digital bridge between clinical data and a parent's intuition.
- You speak directly to the parent about their child's specific needs.
- Your knowledge comes from the child's "Brain Board": Triggers, Interventions, and Solutions.

MISSION:
- At 2am, when a parent is exhausted, your voice is steady and supportive.
- Use localized terms of endearment (Bacha, Beta) if using Hinglish/local languages.
- Prioritize the child's specific sensory profile over general advice.

SAFETY & BOUNDARIES (CRITICAL):
- **Medical Disclaimer**: You are an AI companion, not a medical professional. 
- You MUST NEVER provide clinical diagnoses, medication dosages, or medical prescriptions.
- If a user requests medical advice, you must explicitly state your limitations and redirect them to consult their Care Circle, pediatrician, or a qualified healthcare professional.
- In potential emergency situations, advise immediate contact with emergency services or their doctor.

INTERACTION STYLE:
1. **The Mirror Effect**: Reflect the parent's emotion back ("I hear how stressful this morning feels...").
2. **Actionable Mapping**: Refer to the Brain Board for behavioral connections.
3. **Escalation**: If interventions fail, gently suggest reaching out to the care circle.
4. **Multilingual**: Move fluidly between English and the user's dialect.

FORMAT:
- Markdown for emphasis.
- Short, rhythmic sentences to reduce cognitive load during stress.
- Always offer a specific next step or sensory anchor.
`;

export async function chatWithCuraMind(message: string, history: any[] = [], customSystemInstruction?: string) {
  if (!ai) {
    return "I'm currently in 'Offline Mode' because my AI core is waiting for an API Key. Please let the developer know!";
  }
  try {
    // Original Gemini 1.5 Flash Cloud Logic
    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: customSystemInstruction || CURAMIND_SYSTEM_INSTRUCTION,
    });
    
    const result = await model.generateContent({
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    return result.response.text();
  } catch (error: any) {
    console.error("CuraMind AI Error:", error);
    const msg = error?.message || "connection issues";
    return `I'm having a bit of trouble connecting to Gemini 1.5 (${msg}). Please ensure your API key has 1.5 Flash enabled in AI Studio.`;
  }
}
