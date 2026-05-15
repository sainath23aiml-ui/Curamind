import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, Music, Moon, Target, Sparkles, 
  Volume2, VolumeX, MessageSquare, Clock,
  Play, Pause, RefreshCcw, Smile, Plus, Heart
} from 'lucide-react';

type Mode = 'breathing' | 'sounds' | 'gratitude' | 'muscle' | 'zen-timer' | 'marble';

const SOUNDS = [
  { id: 'rain', label: 'Rain Forest', url: 'https://assets.mixkit.co/music/preview/mixkit-forest-walk-371.mp3' },
  { id: 'piano', label: 'Soft Piano', url: 'https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3' },
  { id: 'waves', label: 'Ocean Waves', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder
  { id: 'zen', label: 'Zen Garden', url: 'https://assets.mixkit.co/music/preview/mixkit-meditation-soft-piano-24.mp3' },
  { id: 'drone', label: 'Cosmos Space', url: 'https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3' },
  { id: 'birds', label: 'Spring Birds', url: 'https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3' }
];

const SanctuaryBackground = ({ mode, phase }: { mode: Mode, phase: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        {mode === 'breathing' && (
          <motion.div 
            key="bg-breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: phase === 'in' ? [1, 1.5, 2] : [2, 1.5, 1],
                  opacity: phase === 'in' ? [0.2, 0.1, 0] : [0, 0.1, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                className="absolute w-[40vw] h-[40vw] rounded-full border border-curamind-green/30"
              />
            ))}
          </motion.div>
        )}

        {mode === 'zen-timer' && (
          <motion.div 
            key="bg-zen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: Math.random() }}
                animate={{ opacity: [0.1, 0.8, 0.1] }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </motion.div>
        )}

        {mode === 'gratitude' && (
          <motion.div 
            key="bg-gratitude"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-curamind-yellow/5 to-transparent" />
          </motion.div>
        )}

        {mode === 'marble' && (
          <motion.div 
            key="bg-marble"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-curamind-green/5 via-curamind-yellow/5 to-curamind-void/5"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export const CalmSanctuary = () => {
  const [activeMode, setActiveMode] = useState<Mode>('breathing');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.5);
  const [activeSound, setActiveSound] = useState(SOUNDS[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 1. Breathing Phase
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying, activeSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume;
    }
  }, [audioVolume]);

  const changeSound = (sound: typeof SOUNDS[0]) => {
    setActiveSound(sound);
    setIsAudioPlaying(true);
  };

  // 2. Gratitude Jar
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [newGratitude, setNewGratitude] = useState('');

  // 3. Zen Timer
  const [timerLeft, setTimerLeft] = useState(300); // 5 mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 4. Muscle Relaxation
  const [muscleStep, setMuscleStep] = useState(0);
  const muscleSteps = [
    { target: "Face", action: "Squeeze your eyes shut and clench your jaw... Hold for a moment." },
    { target: "Shoulders", action: "Raise your shoulders up to your ears... Feel the tension." },
    { target: "Hands", action: "Make tight fists with both hands... Squeeze hard." },
    { target: "Stomach", action: "Tighten your stomach muscles as if someone is about to poke you." },
    { target: "Feet", action: "Curl your toes downward and clench your feet." },
    { target: "Full Body", action: "Take a deep breath and let all the tension melt away at once." }
  ];

  useEffect(() => {
    let interval: any;
    if (activeMode === 'breathing') {
      const sequence = async () => {
        setPhase('in');
        await new Promise(r => setTimeout(r, 4000));
        setPhase('hold');
        await new Promise(r => setTimeout(r, 2000));
        setPhase('out');
        await new Promise(r => setTimeout(r, 4000));
      };
      sequence();
      interval = setInterval(sequence, 10000);
    }
    return () => clearInterval(interval);
  }, [activeMode]);

  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timerLeft > 0) {
      timer = setInterval(() => setTimerLeft(prev => prev - 1), 1000);
    } else if (timerLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timerLeft]);

  // Handle activeMode side effects
  useEffect(() => {
    if (activeMode === 'zen-timer') {
      changeSound(SOUNDS.find(s => s.id === 'drone') || SOUNDS[0]);
    } else if (activeMode === 'breathing') {
      changeSound(SOUNDS.find(s => s.id === 'zen') || SOUNDS[0]);
    }
  }, [activeMode]);

  const addGratitude = () => {
    if (!newGratitude.trim()) return;
    setGratitudes(prev => [...prev, newGratitude.trim()]);
    setNewGratitude('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-12 relative overflow-hidden bg-curamind-void">
      <SanctuaryBackground mode={activeMode} phase={phase} />
      
      <audio ref={audioRef} src={activeSound.url} loop />

      {/* Header controls for audio */}
      <div className="w-full flex justify-between items-start gap-6 relative z-50">
        <div className="flex flex-wrap gap-2 max-w-[60%]">
          {SOUNDS.map(s => (
            <button
              key={s.id}
              onClick={() => changeSound(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSound.id === s.id && isAudioPlaying 
                ? 'bg-curamind-green text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
           <button onClick={() => setIsAudioPlaying(!isAudioPlaying)} className="text-white/60 hover:text-white transition-all">
             {isAudioPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
           </button>
           <input 
             type="range" min="0" max="1" step="0.1" 
             value={audioVolume} onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
             className="w-20 h-1 bg-white/20 rounded-full appearance-none accent-curamind-green cursor-pointer"
           />
        </div>
      </div>

      {/* Primary Content Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl pt-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeMode === 'breathing' && (
            <motion.div 
               key="breathing" 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               exit={{ opacity: 0, scale: 1.1 }}
               className="text-center"
            >
               <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: phase === 'in' ? 1.5 : phase === 'hold' ? 1.5 : 1, opacity: 0.3 }}
                    transition={{ duration: 4 }}
                    className="absolute inset-0 bg-curamind-green rounded-full blur-3xl"
                  />
                  <motion.div 
                    animate={{ scale: phase === 'in' ? 1.4 : phase === 'hold' ? 1.4 : 1 }}
                    transition={{ duration: 4 }}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-white to-curamind-green border-4 border-white/30 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)] relative z-10"
                  >
                    <div className="text-[#050505] font-black text-lg uppercase tracking-tight text-center px-4">
                      {phase === 'in' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Exhale'}
                    </div>
                  </motion.div>
               </div>
               <p className="mt-16 text-white/40 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Breath</p>
            </motion.div>
          )}

          {activeMode === 'gratitude' && (
            <motion.div 
              key="gratitude" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full space-y-12"
            >
               <div className="h-64 relative flex flex-wrap justify-center content-center gap-4 p-8 bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                 <AnimatePresence>
                   {gratitudes.map((g, i) => (
                     <motion.div
                       key={i}
                       initial={{ opacity: 0, scale: 0.5, y: 50 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-black border border-white/10"
                     >
                       {g}
                     </motion.div>
                   ))}
                 </AnimatePresence>
                 {gratitudes.length === 0 && <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Add something you're grateful for...</p>}
               </div>
               <div className="flex gap-4 max-w-lg mx-auto">
                 <input 
                   value={newGratitude}
                   onChange={(e) => setNewGratitude(e.target.value)}
                   className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-curamind-yellow/50 text-lg font-bold"
                   placeholder="I am grateful for..."
                   onKeyPress={(e) => e.key === 'Enter' && addGratitude()}
                 />
                 <button onClick={addGratitude} className="p-5 bg-curamind-yellow text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-curamind-yellow/20">
                   <Plus className="w-7 h-7" />
                 </button>
               </div>
            </motion.div>
          )}

          {activeMode === 'muscle' && (
            <motion.div 
               key="muscle" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="max-w-xl text-center space-y-10"
            >
               <div className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Step {muscleStep + 1} of {muscleSteps.length}</div>
               <h3 className="text-6xl font-black text-curamind-green tracking-tighter">{muscleSteps[muscleStep].target}</h3>
               <p className="text-xl text-white/60 leading-relaxed font-bold min-h-[100px]">
                 {muscleSteps[muscleStep].action}
               </p>
               <div className="flex justify-center gap-6">
                 {muscleStep > 0 && <button onClick={() => setMuscleStep(prev => prev - 1)} className="px-10 py-5 border border-white/10 bg-white/5 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">Back</button>}
                 <button 
                   onClick={() => muscleStep < muscleSteps.length - 1 ? setMuscleStep(prev => prev + 1) : setMuscleStep(0)}
                   className="px-10 py-5 bg-white text-[#050505] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-2xl shadow-white/10"
                 >
                   {muscleStep < muscleSteps.length - 1 ? "Advance" : "Finish Session"}
                 </button>
               </div>
            </motion.div>
          )}

          {activeMode === 'zen-timer' && (
            <motion.div key="zen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-12">
               <div className="text-[140px] font-black text-white leading-none tracking-tighter">
                 {formatTime(timerLeft)}
               </div>
               <div className="flex justify-center gap-6">
                 <button 
                   onClick={() => setIsTimerRunning(!isTimerRunning)}
                   className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isTimerRunning ? 'bg-curamind-red text-white' : 'bg-white text-[#050505]'}`}
                 >
                   {isTimerRunning ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                 </button>
                 <button 
                   onClick={() => { setTimerLeft(300); setIsTimerRunning(false); }}
                   className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
                 >
                   <RefreshCcw className="w-10 h-10" />
                 </button>
               </div>
               <div className="flex gap-4 justify-center">
                 {[60, 300, 600].map(s => (
                   <button key={s} onClick={() => { setTimerLeft(s); setIsTimerRunning(false); }} className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${timerLeft === s ? 'bg-white/10 border border-white/20 text-white' : 'text-white/20 hover:text-white/40'}`}>
                     {s/60}m Session
                   </button>
                 ))}
               </div>
            </motion.div>
          )}

          {activeMode === 'marble' && (
            <motion.div key="marble" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col items-center">
               <div className="relative w-full aspect-video bg-white/[0.02] rounded-[48px] overflow-hidden border border-white/5 group cursor-none shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-white/10 font-black uppercase tracking-[0.4em] text-sm group-hover:opacity-0 transition-opacity">Trace Your Inner Calm</p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                       drag 
                       dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                       className="w-40 h-40 bg-curamind-green/20 rounded-full blur-[80px]"
                       animate={{
                         scale: [1, 1.3, 1],
                       }}
                       transition={{ repeat: Infinity, duration: 3 }}
                    />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation for modes */}
      <div className="w-full max-w-5xl bg-white/[0.02] rounded-[40px] border border-white/5 p-5 backdrop-blur-2xl flex justify-between items-center relative z-50 shadow-2xl">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'breathing', label: 'Breathe', icon: Wind },
            { id: 'gratitude', label: 'Gratitude', icon: Heart },
            { id: 'muscle', label: 'Release', icon: Target },
            { id: 'zen-timer', label: 'Zen Timer', icon: Clock },
            { id: 'marble', label: 'Trace', icon: Wind }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-xs transition-all uppercase tracking-widest ${
                activeMode === mode.id ? 'bg-white text-[#050505] shadow-2xl scale-105' : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <mode.icon className="w-5 h-5" />
              <span className="hidden lg:inline">{mode.label}</span>
            </button>
          ))}
        </div>
        <div className="hidden md:flex px-8 py-5 bg-white/5 border border-white/5 rounded-[24px] items-center gap-4">
           <Music className="w-5 h-5 text-curamind-green animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Sanctuary Audio Active</span>
        </div>
      </div>
    </div>
  );
};
