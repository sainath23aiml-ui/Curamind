import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Moon, Music, ChevronLeft, 
  CheckCircle2, Trophy, ArrowRight, HeartPulse, Wind
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Quest {
  id: string;
  title: string;
  desc: string;
  pts: number;
  icon: any;
  color: string;
  completed?: boolean;
}

const QUEST_TEMPLATES: Quest[] = [
  { id: 'q1', title: "The Knight's Armor", desc: "15 mins with weighted vest", pts: 50, icon: Shield, color: "curamind-green" },
  { id: 'q2', title: "Silent Sanctuary", desc: "Complete 3 breathing sets", pts: 30, icon: Moon, color: "curamind-yellow" },
  { id: 'q3', title: "The Sonic Shield", desc: "Use noise wraps during transit", pts: 40, icon: Music, color: "curamind-yellow" },
  { id: 'q4', title: "Meadow Wanderer", desc: "10 mins outdoor ground walk", pts: 60, icon: HeartPulse, color: "curamind-red" },
  { id: 'q5', title: "Cloud Whisperer", desc: "Find 3 animal shapes in clouds", pts: 25, icon: Wind, color: "curamind-green" }
];

export const QuestPage = ({ childId, onBack }: { childId: string; onBack: () => void }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [auraPoints, setAuraPoints] = useState(0);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!childId || childId === 'demo-child') {
      setQuests(QUEST_TEMPLATES.map(q => ({ ...q, completed: false })));
      return;
    }

    const fetchData = async () => {
      const { data: childData } = await supabase.from('children').select('aura_points').eq('id', childId).single();
      if (childData) setAuraPoints(childData.aura_points || 0);

      const { data: completions } = await supabase.from('quests').select('id').eq('child_id', childId).eq('completed', true);
      const completedIds = completions?.map(c => c.id) || [];
      
      setQuests(QUEST_TEMPLATES.map(q => ({
        ...q,
        completed: completedIds.includes(q.id)
      })));
    };

    fetchData();
  }, [childId]);

  const completeQuest = async (quest: Quest) => {
    if (quest.completed || completingId) return;
    setCompletingId(quest.id);
    try {
      if (childId !== 'demo-child') {
        await supabase.from('quests').upsert({
          id: quest.id,
          child_id: childId,
          completed: true,
          completed_at: new Date().toISOString(),
          title: quest.title,
          points: quest.pts
        });
        const newTotal = auraPoints + quest.pts;
        await supabase.from('children').update({ aura_points: newTotal }).eq('id', childId);
        setAuraPoints(newTotal);
      } else {
        setAuraPoints(prev => prev + quest.pts);
      }
      setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, completed: true } : q));
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-12 pb-24 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Child Quests</h1>
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Growth Protocol Active</p>
          </div>
        </div>

        <div className="px-8 py-4 bg-curamind-yellow/10 border border-curamind-yellow/20 rounded-2xl flex items-center gap-4">
           <Trophy className="w-5 h-5 text-curamind-yellow" />
           <div className="text-2xl font-black text-curamind-yellow">{auraPoints.toLocaleString()} <span className="text-[10px] opacity-60">AURA</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`p-10 rounded-[48px] border transition-all duration-500 ${
              quest.completed ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/5 border-white/10 hover:border-curamind-green shadow-xl'
            }`}
          >
            <div className="flex justify-between items-start mb-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${quest.completed ? 'bg-white/10' : 'bg-curamind-green/20 text-curamind-green'}`}>
                <quest.icon className="w-7 h-7" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-curamind-yellow">+{quest.pts} XP</div>
            </div>
            
            <h3 className={`text-2xl font-black mb-2 ${quest.completed ? 'text-white/40' : 'text-white'}`}>{quest.title}</h3>
            <p className="text-white/40 text-sm font-bold mb-10 leading-relaxed">{quest.desc}</p>

            {quest.completed ? (
              <div className="flex items-center gap-3 text-curamind-green font-black uppercase tracking-widest text-[10px]">
                <CheckCircle2 className="w-5 h-5" /> Completed
              </div>
            ) : (
              <button 
                onClick={() => completeQuest(quest)}
                disabled={!!completingId}
                className="w-full py-4 bg-curamind-green text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {completingId === quest.id ? "Syncing..." : "Complete Task"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
