import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Book, Save, Printer, Share2, Info, Shield, FileText } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

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

export const SocialStoryGenerator = () => {
  const [topic, setTopic] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const generateStory = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStory('');
    setImageUrl(null);
    
    const prompt = `Create a short, empathetic Social Story for a child with autism about the following transition or situation: "${topic}". Use simple, direct language. Follow Carol Gray's social story framework (descriptive, perspective, and directive sentences). Keep it warm and encouraging.`;

    // 1. Try Local Gemma 3
    try {
      const localResponse = await fetch("http://127.0.0.1:1234/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "local-model",
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (localResponse.ok) {
        const data = await localResponse.json();
        setStory(data.choices[0].message.content);
        setLoading(false);
        return;
      }
    } catch (e) { /* Fallback to Gemini */ }

    if (!ai) {
      setStory("AI Storytelling is currently hibernating. Add a GEMINI_API_KEY to wake it up!");
      setLoading(false);
      return;
    }
    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(prompt);
      
      const storyText = response.response.text() || "I'm listening and learning...";
      setStory(storyText);

      // Generate Image
      setImageLoading(true);
      const imgPrompt = `A warm, soft, friendly child-book style illustration for a social story about: ${topic}. Hand-drawn aesthetic, high contrast, non-threatening characters.`;
      const imgModel = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const imgResponse = await imgModel.generateContent(imgPrompt);
      
      try {
        const parts = imgResponse.response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            setImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            break;
          }
        }
      } catch (e) {
        console.warn("Image extraction failed");
      }
    } catch (error) {
      console.error("Story generation failed:", error);
      setStory("I'm sorry, I couldn't generate a story right now.");
    } finally {
      setLoading(false);
      setImageLoading(false);
    }
  };

  return (
    <div className="space-y-10 text-white">
      <div className="bg-white/5 p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
        <h3 className="text-4xl font-black mb-4">Story Architect</h3>
        <p className="text-white/40 font-bold mb-12 max-w-xl leading-relaxed text-sm">
          Transform challenging transitions into safe narratives. AI-powered, parent-approved clinical logic.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Going to the dentist, Loud fire drills..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-bold focus:outline-none focus:border-curamind-green transition-all placeholder:text-white/20"
            />
          </div>
          <button 
            onClick={generateStory}
            disabled={loading || !topic.trim()}
            className="px-10 py-5 bg-curamind-green text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-curamind-green/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Crafting..." : <><FileText className="w-5 h-5" /> Generate</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {story && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-10"
          >
            <div className="lg:col-span-3 bg-[#0A0A0A] p-12 rounded-[48px] border border-white/5 shadow-2xl space-y-10">
              <div className="flex justify-between items-center pb-8 border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-curamind-green/20 flex items-center justify-center text-curamind-green">
                       <Book className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Visual Narrative</span>
                 </div>
                 <div className="flex gap-3">
                    <button className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"><Printer className="w-5 h-5" /></button>
                    <button className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
                    <button className="w-12 h-12 bg-curamind-green/20 rounded-xl flex items-center justify-center text-curamind-green hover:bg-curamind-green hover:text-white transition-all"><Save className="w-5 h-5" /></button>
                 </div>
              </div>
              
              <div className="prose prose-invert prose-lg max-w-none">
                 <ReactMarkdown>{story}</ReactMarkdown>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-10">
               <div className="bg-white/5 border border-white/10 rounded-[48px] overflow-hidden aspect-[4/5] relative shadow-2xl flex items-center justify-center p-8">
                  {imageLoading ? (
                    <div className="text-center space-y-4">
                       <div className="w-12 h-12 border-4 border-curamind-green/30 border-t-curamind-green rounded-full animate-spin mx-auto" />
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Visualizing...</p>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Social Story" className="w-full h-full object-cover rounded-[32px]" />
                  ) : (
                    <div className="text-center space-y-6 opacity-30">
                       <Book className="w-20 h-20 mx-auto" />
                       <p className="text-sm font-black uppercase tracking-widest leading-loose">Visual Support <br /> Contextualizing</p>
                    </div>
                  )}
               </div>
               
               <div className="p-10 bg-curamind-yellow/10 border border-curamind-yellow/20 rounded-[40px] text-curamind-yellow">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    Clinical Guidance
                  </h4>
                  <p className="text-sm font-bold leading-relaxed">
                    Read this story together at least 3 times before the actual event happens to build familiarity and safety.
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
