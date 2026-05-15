/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { AnimatedNumber } from '../shared/AnimatedNumber';
import { Calendar, AlertCircle, Clock, Info } from 'lucide-react';

interface RiskFactor {
  label: string;
  score: number;
  icon: any;
}

const factors: RiskFactor[] = [
  { label: "Friday Afternoon", score: 25, icon: Calendar },
  { label: "Schedule Change", score: 22, icon: AlertCircle },
  { label: "Poor Sleep Logged", score: 18, icon: Clock },
  { label: "3 Days Since Last", score: 13, icon: Info },
];

export const RiskScoreGauge = ({ score = 78 }: { score?: number }) => {
  const rotation = (score / 100) * 180 - 90;
  const color = score > 66 ? '#FF5E7A' : score > 33 ? '#FFB347' : '#00E5A0';
  
  return (
    <GlassCard className="flex flex-col items-center">
      <h3 className="text-xl font-black mb-8 self-start text-white">Daily Balance Check</h3>
      
      <div className="relative w-64 h-32 overflow-hidden mb-8">
        <div className="absolute w-64 h-64 border-[12px] border-white/5 rounded-full" />
        <motion.div 
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-64 h-64 border-[12px] border-t-transparent border-l-transparent border-r-transparent rounded-full z-10"
          style={{ borderColor: color, borderBottomColor: color }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
          <AnimatedNumber value={score} className="text-5xl font-black text-white" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Sensitivity Level</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {factors.map((factor, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-curamind-green/20 text-curamind-green">
                <factor.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white/80">{factor.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-curamind-green">+{factor.score}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 w-full">
        <button className="w-full py-4 bg-curamind-green text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">
          Prepare Morning Pack
        </button>
      </div>
    </GlassCard>
  );
};
