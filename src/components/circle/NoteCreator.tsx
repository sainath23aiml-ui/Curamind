import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, FileText, CheckCircle2, Sparkles, X, User, Heart, Brain, GraduationCap, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateClinicalNote } from '@/lib/gemini';

type Recipient = 'everyone' | 'teacher' | 'therapist' | 'ai';

export const NoteCreator = ({ childId, onCancel }: { childId: string, onCancel: () => void }) => {
  const [content, setContent] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recipient, setRecipient] = useState<Recipient>('everyone');

  const handleAIDraft = async () => {
    if (!content.trim()) return;
    setAiLoading(true);
    const result = await generateClinicalNote(content);
    setContent(result.content);
    setRecommendations(result.recommendations);
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (childId !== 'demo-child') {
        const { error } = await supabase.from('notes').insert({
          author_id: session?.user?.id || null,
          author_name: session?.user?.user_metadata?.full_name || 'Parent',
          content,
          recommendations,
          recipient,
          child_id: childId
        });
        if (error) throw error;
      }
      
      setSuccess(true);
      setTimeout(() => onCancel(), 2000);
    } catch (error) {
      console.error("Failed to send note:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-10 rounded-[48px] border border-white/10 space-y-10 shadow-3xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/5">
        <h3 className="text-2xl font-black text-white uppercase tracking-widest">
          Clinical Observation
        </h3>
        <button onClick={onCancel} className="p-3 bg-white/5 text-white/40 hover:text-white rounded-2xl transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-6">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Select Recipient</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(['everyone', 'teacher', 'therapist', 'ai'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRecipient(r)}
                  className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    recipient === r 
                      ? 'bg-curamind-green text-white border-curamind-green shadow-xl shadow-curamind-green/20' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 relative">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Details</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record sensory patterns or behaviors..."
              className="w-full h-48 p-8 bg-black/40 rounded-[32px] border border-white/5 outline-none focus:border-curamind-green transition-all font-bold text-white placeholder:text-white/10 resize-none shadow-inner"
              required
            />
            {content.length > 20 && (
               <button
                type="button"
                onClick={handleAIDraft}
                disabled={aiLoading}
                className="absolute bottom-6 right-6 px-6 py-3 bg-curamind-green/10 text-curamind-green rounded-xl text-[10px] font-black uppercase tracking-widest border border-curamind-green/20"
              >
                {aiLoading ? 'Refining...' : 'Refine Note'}
              </button>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Strategies</label>
            <textarea 
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              placeholder="What worked? What's the plan?"
              className="w-full h-24 p-8 bg-black/40 rounded-[32px] border border-white/5 outline-none focus:border-curamind-green transition-all font-bold text-white placeholder:text-white/10 text-sm resize-none shadow-inner"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || aiLoading}
            className="w-full py-6 bg-curamind-green text-white rounded-[32px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-curamind-green/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? 'Transmitting...' : `Synchronize with ${recipient}`}
          </button>
        </form>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="py-20 flex flex-col items-center justify-center text-center space-y-8"
        >
          <div className="w-24 h-24 bg-curamind-green/10 rounded-[40px] flex items-center justify-center text-curamind-green shadow-xl border border-curamind-green/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h4 className="text-3xl font-black text-white">Insight Logged</h4>
            <p className="text-white/40 font-bold mt-4 uppercase tracking-[0.2em] text-[10px]">Successfully synchronized</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
