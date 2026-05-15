/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Stethoscope, Globe, Phone, AlertTriangle, MessageCircle, Settings } from 'lucide-react';
import { chatWithCuraMind } from '@/lib/chat/curamindAI';
import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export const ChatWindow = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      session_id: 's1',
      role: 'assistant',
      content: "Namaste. ☀️ I've checked the latest insights and everything seems stable. How can I support you and your child today?",
      language: 'en',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      session_id: 's1',
      role: 'user',
      content: input,
      language: 'en',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await chatWithCuraMind(input, history);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        session_id: 's1',
        role: 'assistant',
        content: response || "I'm listening and learning...",
        language: 'en',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const QUICK_ACTIONS = [
    "Crisis support",
    "He's overstimulated",
    "Logging an event",
    "School update"
  ];

  return (
    <div className="flex flex-col h-[700px] bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden mt-8 mb-12 shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-curamind-green/20 flex items-center justify-center">
            <Stethoscope className="text-curamind-green w-7 h-7" />
          </div>
          <div>
            <h3 className="font-black text-lg text-white">CuraMind Companion</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-curamind-green animate-pulse" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Always Listening</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="hidden sm:flex items-center gap-2 text-curamind-coral font-bold text-xs bg-curamind-coral/5 px-4 py-2 rounded-full border border-curamind-coral/10 hover:bg-curamind-coral/10 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" /> Escalate
           </button>
           <button className="p-2 text-curamind-muted hover:text-curamind-purple transition-colors">
              <Globe className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth bg-curamind-void/30"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={cn(
                "max-w-[85%] p-6 rounded-[32px] font-medium text-sm organic-shadow leading-relaxed",
                msg.role === 'user' 
                  ? "bg-curamind-green text-white rounded-tr-sm" 
                  : "bg-white/5 border border-white/10 text-white rounded-tl-sm"
              )}>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <div className={cn(
                  "text-[9px] mt-3 font-bold uppercase tracking-tight",
                  msg.role === 'user' ? "text-white/60" : "text-white/30"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] rounded-tl-sm flex gap-1.5">
              {[0, 200, 400].map((delay, idx) => (
                <motion.div
                  key={idx}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: idx * 0.2 }}
                  className="w-2 h-2 rounded-full bg-curamind-green/40"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-[#0D0D0D] border-t border-white/5 space-y-6">
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action}
              onClick={() => setInput(action)}
              className="whitespace-nowrap px-5 py-2.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-curamind-green hover:border-curamind-green/30 transition-all"
            >
              {action}
            </button>
          ))}
        </div>
        
        <div className="relative group">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Talk to CuraMind AI..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 pr-20 text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleSend}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-curamind-green rounded-xl flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
