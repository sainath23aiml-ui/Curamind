import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: 'test' });
console.log('Keys:', Object.keys(ai));
console.log('Prototype Keys:', Object.keys(Object.getPrototypeOf(ai)));
