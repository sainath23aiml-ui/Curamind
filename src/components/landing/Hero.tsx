/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ParticleBackground } from '../shared/ParticleBackground';
import { GlassCard } from '../shared/GlassCard';
import { AnimatedNumber } from '../shared/AnimatedNumber';
import { scrollReveal, staggerContainer, slideUp } from '@/lib/utils/animations';

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6">
      <ParticleBackground />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-curamind-purple/10 text-curamind-purple mb-8">
          <span className="text-xs font-bold uppercase tracking-widest">
            🏆 National Hackathon 2025 · Social Impact
          </span>
        </motion.div>

        <motion.h1 
          variants={slideUp}
          className="text-6xl md:text-8xl font-sora font-extrabold leading-[0.95] tracking-tighter mb-8 text-curamind-text"
        >
          Every meltdown <br />
          <span className="text-curamind-purple italic font-light">has a pattern.</span> <br />
          CuraMind learns it.
        </motion.h1>

        <motion.p 
          variants={slideUp}
          className="max-w-2xl mx-auto text-xl text-curamind-muted mb-12 font-sans font-medium"
        >
          India's first AI companion that understands your child's unique emotional map — 
          supporting parents in every language, during every crisis.
        </motion.p>

        <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-curamind-purple hover:bg-curamind-purple/90 text-white rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
          >
            Start your child's profile
          </button>
          <button className="px-10 py-5 bg-white border border-curamind-rim hover:border-curamind-purple rounded-full font-bold transition-all text-lg">
            Watch Arjun's story
          </button>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          <GlassCard className="text-center group hover:border-curamind-purple/40">
            <div className="text-4xl font-sora font-extrabold text-curamind-text mb-2">1 : 10,000</div>
            <div className="text-sm text-curamind-muted">Psychiatrist to autistic child ratio in India</div>
          </GlassCard>
          <GlassCard className="text-center group hover:border-curamind-teal/40">
            <div className="text-4xl font-sora font-extrabold text-curamind-text mb-2">30+ days</div>
            <div className="text-sm text-curamind-muted">Average wait between therapy sessions</div>
          </GlassCard>
          <GlassCard className="text-center group hover:border-curamind-coral/40">
            <div className="text-4xl font-sora font-extrabold text-curamind-text mb-2">80%</div>
            <div className="text-sm text-curamind-muted">Crisis moments handled without escalation</div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
};
