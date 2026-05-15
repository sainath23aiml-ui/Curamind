/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../shared/GlassCard';
import { AnimatedNumber } from '../shared/AnimatedNumber';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'purple' | 'teal' | 'coral' | 'gold';
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix = "",
  trend,
  trendValue,
  color = "purple",
  description,
  className
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  return (
    <div className={cn(
      "relative overflow-hidden bg-curamind-surface/40 border border-white/10 rounded-[24px] lg:rounded-[32px] p-5 lg:p-8 transition-all duration-500 hover:scale-[1.03] group",
      className
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-curamind-rim/20 to-transparent rounded-bl-[60px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-curamind-muted uppercase tracking-widest">{label}</span>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
            trend === 'down' ? "bg-curamind-teal/10 text-curamind-teal" : 
            trend === 'up' ? "bg-curamind-coral/10 text-curamind-coral" : 
            "bg-curamind-muted/10 text-curamind-muted"
          )}>
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <AnimatedNumber 
          value={value} 
          className={cn("text-4xl font-sora font-extrabold", `text-curamind-${color}`)}
        />
        <span className="text-sm font-bold text-curamind-muted">{suffix}</span>
      </div>

      {description && (
        <p className="text-[10px] text-curamind-muted font-medium line-clamp-1">{description}</p>
      )}
    </div>
  );
};
