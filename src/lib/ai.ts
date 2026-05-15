/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled. Please set the environment variable in your .env file.");
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
    return null;
  }
}

export const genAI = getAI();

/**
 * Returns a model instance for a specific model name.
 * Handles cases where genAI is not initialized.
 */
export function getAIModel(modelName: string = "gemini-1.5-flash") {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
}
