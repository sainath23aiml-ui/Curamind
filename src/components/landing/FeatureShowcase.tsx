/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Stethoscope, LayoutDashboard, LineChart, MessageCircle, School, UserPlus } from 'lucide-react';
import { GlassCard } from '../shared/GlassCard';
import { scrollReveal, staggerContainer } from '@/lib/utils/animations';

const features = [
  {
    title: "Live Meltdown Dashboard",
    description: "See your child's patterns visualized in real-time.",
    icon: LayoutDashboard,
    color: "coral",
    size: "large"
  },
  {
    title: "CuraMind Graph",
    description: "A growing ecosystem, unique to your child.",
    icon: Stethoscope,
    color: "purple",
    size: "large"
  },
  {
    title: "Prediction Engine",
    description: "We prevent crises, not just respond.",
    icon: LineChart,
    color: "teal",
    size: "medium"
  },
  {
    title: "Calm Corner",
    description: "For your child, when words are too hard.",
    icon: MessageCircle,
    color: "gold",
    size: "medium"
  },
  {
    title: "Therapist Portal",
    description: "One therapist, 5x more families.",
    icon: UserPlus,
    color: "purple",
    size: "medium"
  },
  {
    title: "Teacher Alert Card",
    description: "School is part of the ecosystem.",
    icon: School,
    color: "teal",
    size: "medium"
  }
];

export const FeatureShowcase = () => {
  return (
    <section className="py-24 px-6 bg-curamind-void">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={scrollReveal}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-6 font-bold">
            Built for families, <span className="text-curamind-purple italic font-light">trusted by experts.</span>
          </h2>
          <p className="text-curamind-muted text-lg max-w-2xl mx-auto font-medium">
            CuraMind brings the whole care team together, translating raw behavioral patterns into actionable shared insights.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
        >
          {features.map((feature, idx) => (
            <div key={idx} className={feature.size === 'large' ? 'md:col-span-3' : 'md:col-span-2'}>
              <GlassCard className="h-full group hover:border-white/10 transition-colors">
                <div className={`p-3 rounded-xl bg-curamind-${feature.color}/10 w-fit mb-6`}>
                  <feature.icon className={`w-6 h-6 text-curamind-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-curamind-muted mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-sm text-curamind-purple opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <span className="text-xl">→</span>
                </div>
              </GlassCard>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
