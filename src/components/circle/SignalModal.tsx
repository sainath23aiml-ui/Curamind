import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Siren, X, Send, Heart, Zap, Info, Shield, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SignalModal = ({ isOpen, onClose, childId }: { isOpen: boolean, onClose: () => void, childId: string }) => {
  const [message, setMessage] = useState('');
  const [intervention, setIntervention] = useState('');
  const [loading, setLoading] = useState(false);

  const sendSignal = async () => {
    if (!message || !intervention) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (childId !== 'demo-child') {
        const { error } = await supabase.from('alerts').insert({
          child_id: childId,
          author_id: session?.user?.id || null,
          author_name: session?.user?.user_metadata?.full_name || 'Care Leader',
          message,
          intervention,
          status: 'active'
        });
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-[#050510]/95 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-curamind-depth rounded-[48px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 relative"
      >
        <div className="bg-curamind-red p-12 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
              <Siren className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-3xl font-sora font-black tracking-tight leading-none">Care Signal</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-2">Immediate Protocol Activation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-12 space-y-10">
          <div className="p-6 bg-curamind-red/5 border border-curamind-red/20 rounded-3xl">
            <p className="text-curamind-red font-bold text-xs leading-relaxed uppercase tracking-widest text-center">
              INSTANT NOTIFICATION TO THE ENTIRE CARE CIRCLE
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 px-2">Sensory Observation</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the current behavioral state..."
              className="w-full h-28 p-6 bg-black/40 rounded-[28px] border border-white/5 outline-none focus:border-curamind-red transition-all font-bold text-sm text-white placeholder:text-white/10 resize-none shadow-inner"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 px-2">Clinical Directive</label>
            <textarea 
              value={intervention}
              onChange={(e) => setIntervention(e.target.value)}
              placeholder="What specifically should be done right now?"
              className="w-full h-28 p-6 bg-black/40 rounded-[28px] border border-white/5 outline-none focus:border-curamind-red transition-all font-bold text-sm text-white placeholder:text-white/10 resize-none shadow-inner"
            />
          </div>

          <button 
            onClick={sendSignal}
            disabled={loading || !message || !intervention}
            className="w-full py-6 bg-curamind-red text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-curamind-red/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40"
          >
            {loading ? 'Transmitting...' : (
              <>
                <Send className="w-6 h-6" /> Broadcast Signal
              </>
            )}
          </button>
        </div>
        <Activity className="absolute -bottom-20 -right-20 w-80 h-80 opacity-[0.03] text-white pointer-events-none" />
      </motion.div>
    </div>
  );
};
