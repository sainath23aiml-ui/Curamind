import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, AlertCircle, CheckCircle2, Moon, Sun, Coffee, Music, Trash2, Shield, Brain, Sparkles, CloudRain, Wind, Thermometer, Mic, MicOff, Volume2, Sliders, Activity } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';

interface SensoryEvent {
  id: string;
  label: string;
  pts: number;
  type: 'load' | 'recovery';
  icon: any;
  time: string;
}

export const SensoryBudget = () => {
  const [activeTab, setActiveTab] = useState<'budget' | 'forecast'>('budget');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(42);

  useEffect(() => {
    let interval: any;
    if (isMonitoring) {
      interval = setInterval(() => {
        setNoiseLevel(prev => Math.max(30, Math.min(95, prev + (Math.random() * 20 - 10))));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const events: SensoryEvent[] = [
    { id: '1', label: 'School Bus Ride', pts: 45, type: 'load', icon: Sun, time: '8:00 AM' },
    { id: '2', label: 'Weighted Blanket Time', pts: -30, type: 'recovery', icon: Moon, time: '10:30 AM' },
    { id: '3', label: 'Classroom Lunch', pts: 60, type: 'load', icon: Coffee, time: '12:30 PM' },
    { id: '4', label: 'Noise Cancelling Protocol', pts: -20, type: 'recovery', icon: Music, time: '2:00 PM' },
  ];

  const totalUsed = events.reduce((acc, curr) => acc + curr.pts, 0);
  const maxBudget = 200;
  const percentage = (totalUsed / maxBudget) * 100;

  return (
    <div className="space-y-12 pb-24 text-white">
      <div className="flex bg-white/5 p-2 rounded-3xl w-fit mx-auto border border-white/5 mb-8">
        <button 
          onClick={() => setActiveTab('budget')}
          className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'budget' ? 'bg-white text-[#050505] shadow-2xl' : 'text-white/40'}`}
        >
          Daily Budget
        </button>
        <button 
          onClick={() => setActiveTab('forecast')}
          className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'forecast' ? 'bg-white text-[#050505] shadow-2xl' : 'text-white/40'}`}
        >
          Sensory Forecast
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'budget' ? (
          <motion.div 
            key="budget"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-10">
              <GlassCard className="p-12 relative overflow-hidden h-fit">
                <div className="flex justify-between items-center mb-12 relative z-10">
                   <div>
                      <h3 className="text-3xl font-black text-white">Sensory Energy</h3>
                      <p className="text-white/40 font-bold mt-2 uppercase tracking-widest text-[10px]">Monitoring internal load capacity.</p>
                   </div>
                   <div className="text-right">
                      <div className="text-5xl font-black text-white">{maxBudget - totalUsed}</div>
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Pts Remaining</div>
                   </div>
                </div>

                <div className="relative h-5 bg-white/5 rounded-full overflow-hidden mb-12 border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${percentage}%` }}
                     className={`h-full transition-colors duration-1000 ${
                       percentage > 80 ? 'bg-curamind-red' : percentage > 50 ? 'bg-curamind-yellow' : 'bg-curamind-green'
                     }`}
                   />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-2">Total Load</div>
                      <div className="text-2xl font-black text-curamind-red">105 pts</div>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-2">Recovery</div>
                      <div className="text-2xl font-black text-curamind-green">50 pts</div>
                   </div>
                   <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <div className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-2">Critical Cap</div>
                      <div className="text-2xl font-black text-white">200 pts</div>
                   </div>
                </div>
              </GlassCard>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-4">Event Log</h4>
                 <div className="space-y-4">
                    {events.map((ev, i) => (
                      <motion.div 
                        key={ev.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-white/5 p-6 rounded-[32px] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all shadow-xl"
                      >
                        <div className="flex items-center gap-6">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ev.type === 'load' ? 'bg-curamind-red/10 text-curamind-red' : 'bg-curamind-green/10 text-curamind-green'}`}>
                              <ev.icon className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="text-base font-black text-white">{ev.label}</div>
                              <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{ev.time}</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className={`text-sm font-black ${ev.type === 'load' ? 'text-curamind-red' : 'text-curamind-green'}`}>
                              {ev.type === 'load' ? '+' : '-'}{Math.abs(ev.pts)} pts
                           </div>
                           <button className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-curamind-red transition-all">
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-10">
               <div className="bg-curamind-surface border border-white/10 rounded-[48px] overflow-hidden aspect-square relative shadow-2xl flex flex-col items-center justify-center p-12">
                  {isMonitoring ? (
                    <div className="space-y-8 w-full">
                      <div className="flex justify-between items-end">
                        <div className="text-6xl font-black text-white leading-none">
                          {Math.round(noiseLevel)} <span className="text-sm text-white/20 ml-1 uppercase">dB</span>
                        </div>
                        <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${noiseLevel > 75 ? 'bg-curamind-red/10 text-curamind-red' : 'bg-curamind-green/10 text-curamind-green'}`}>
                          {noiseLevel > 75 ? 'High Intensity' : 'Safe Range'}
                        </div>
                      </div>
                      <div className="flex gap-1 h-32 items-end">
                        {[...Array(30)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ height: isMonitoring ? `${Math.random() * 80 + 20}%` : '10%' }}
                            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                            className={`flex-1 rounded-t-sm ${noiseLevel > 75 ? 'bg-curamind-red' : 'bg-curamind-green'}`}
                          />
                        ))}
                      </div>
                      <button onClick={() => setIsMonitoring(false)} className="w-full py-4 bg-curamind-red/10 text-curamind-red rounded-2xl font-black uppercase text-[10px] tracking-widest">Stop Monitor</button>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto text-white/20">
                        <Mic className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-black text-white/20 px-4 leading-relaxed uppercase tracking-widest italic">Awaiting Input</p>
                      <button onClick={() => setIsMonitoring(true)} className="px-8 py-4 bg-curamind-green text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-curamind-green/20">Listen Ambient</button>
                    </div>
                  )}
               </div>
               
               <div className="p-10 bg-curamind-surface border border-white/5 rounded-[48px] text-white relative shadow-2xl">
                  <h4 className="text-[10px] font-black mb-10 uppercase tracking-[0.3em] text-white/40">
                     Sensory Protocol
                  </h4>
                  <div className="space-y-4">
                     {[
                       { text: "Noise-cancelling break now", icon: Music },
                       { text: "Dim lights to 20%", icon: Moon },
                       { text: "Apply weighted lap pad", icon: Shield },
                       { text: "Activate sanctuary audio", icon: Activity }
                     ].map((tip, i) => (
                       <button key={i} className="w-full flex gap-4 items-center bg-white/5 p-5 rounded-[24px] border border-white/5 text-sm font-black hover:bg-white/10 transition-all text-left group">
                          <tip.icon className="w-5 h-5 text-curamind-green group-hover:scale-110 transition-transform" />
                          <span className="text-white/60 group-hover:text-white transition-colors">{tip.text}</span>
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="forecast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {[
                { time: "09:00", label: "School Transition", load: "High", icon: Sun, color: "curamind-red" },
                { time: "11:30", label: "Group Activity", load: "Medium", icon: Wind, color: "curamind-yellow" },
                { time: "13:00", label: "Lunch Hall", load: "Extreme", icon: Zap, color: "curamind-red" },
                { time: "15:30", label: "Recovery Period", load: "Recovery", icon: Moon, color: "curamind-green" },
              ].map((slot, i) => (
                <div key={i} className="bg-white/5 p-10 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all">
                  <div className={`absolute top-0 left-0 w-full h-3 bg-${slot.color}`} />
                  <div className="text-3xl font-black text-white mb-6 tracking-tighter">{slot.time}</div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl bg-white/10 text-${slot.color}`}>
                       <slot.icon className="w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Intensity: {slot.load}</div>
                  </div>
                  <h5 className="text-xl font-black text-white leading-tight mb-10">{slot.label}</h5>
                  <div className="p-5 rounded-3xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 italic uppercase tracking-widest leading-loose">
                    Forecast: Suggesting buffers 15m prior.
                  </div>
                </div>
              ))}
            </div>

            <GlassCard className="p-12 relative overflow-hidden h-auto flex flex-col justify-center items-center text-center">
               <div className="max-w-xl space-y-10 py-10">
                 <div className="w-24 h-24 bg-curamind-green/10 rounded-[40px] flex items-center justify-center mx-auto text-curamind-green mb-4">
                    <Activity className="w-10 h-10" />
                 </div>
                 <h4 className="text-5xl font-black text-white tracking-tighter">Seasonal Calibration</h4>
                 <p className="text-white/40 font-bold text-xl leading-relaxed">
                   Analyzing long-term sensitivity patterns. Predicted 20% increase in audio load next week due to fire drills.
                 </p>
                 <div className="flex gap-4 justify-center">
                   <button className="px-10 py-5 bg-curamind-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-curamind-green/20">Apply Proactive Shielding</button>
                   <button className="px-10 py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Review Full Data</button>
                 </div>
               </div>
               <CloudRain className="absolute top-10 right-10 w-48 h-48 opacity-[0.02] text-curamind-red" />
               <Wind className="absolute bottom-10 left-10 w-48 h-48 opacity-[0.02] text-curamind-green" />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
