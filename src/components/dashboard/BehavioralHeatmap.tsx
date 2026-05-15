/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { staggerContainer, fadeIn } from '@/lib/utils/animations';

const HOURS = Array.from({ length: 8 }, (_, i) => `${i * 3}am`);
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Mock data: 7 days x 24 hours (simplified to 8 slots of 3h each)
const HEATMAP_DATA = [
  [0, 1, 0, 0, 2, 0, 0, 0], // Mon
  [0, 0, 0, 1, 3, 2, 0, 0], // Tue
  [1, 0, 0, 0, 0, 1, 0, 0], // Wed
  [0, 0, 2, 4, 1, 0, 0, 0], // Thu
  [0, 0, 0, 0, 8, 9, 2, 0], // Fri (Peak)
  [0, 2, 0, 0, 1, 2, 1, 0], // Sat
  [0, 0, 1, 0, 3, 5, 7, 1], // Sun (Peak evening)
];

const getColor = (val: number) => {
  if (val === 0) return 'bg-white/5';
  if (val < 3) return 'bg-curamind-green/30';
  if (val < 6) return 'bg-curamind-yellow/40';
  if (val < 8) return 'bg-curamind-red/40';
  return 'bg-curamind-red shadow-[0_0_15px_rgba(239,68,68,0.3)]';
};

export const BehavioralHeatmap = () => {
  return (
    <GlassCard className="col-span-1 md:col-span-2">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">Activity Rhythm</h3>
        <div className="flex gap-4">
          {['Calm', 'Peak'].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-curamind-green/30' : 'bg-curamind-red'}`} />
              <span className="text-[10px] font-black text-white/40 uppercase">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <div className="flex flex-col justify-between py-2 text-[10px] text-curamind-muted font-bold h-[200px] uppercase">
          {DAYS.map(day => <div key={day}>{day}</div>)}
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-8 grid-rows-7 gap-3 h-[200px]"
        >
          {HEATMAP_DATA.map((row, dayIdx) => (
            row.map((val, hourIdx) => (
              <motion.div
                key={`${dayIdx}-${hourIdx}`}
                variants={fadeIn}
                className={`rounded-lg ${getColor(val)} transition-all hover:ring-2 hover:ring-curamind-purple/20 cursor-help relative group`}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-curamind-surface border border-white/10 rounded-lg text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20 shadow-2xl text-white">
                  {DAYS[dayIdx]} slots are {val > 5 ? 'active' : 'calm'}
                </div>
              </motion.div>
            ))
          ))}
        </motion.div>

        <div />
        <div className="flex justify-between text-[10px] text-curamind-muted font-mono">
          {HOURS.map(hour => <div key={hour}>{hour}</div>)}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-curamind-red/10 text-[11px] text-curamind-red font-bold uppercase tracking-wider">
          Peak time: Friday 3pm-6pm (School transition)
        </div>
      </div>
    </GlassCard>
  );
};
