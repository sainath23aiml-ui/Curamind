import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  User, Shield, Briefcase, Mail, CheckCircle2, 
  ChevronDown, Heart, Zap, Star, Layout, 
  MessageSquare, Sliders, Activity, Headphones, Home,
  Users, Calendar, Bell, ArrowRight, Stethoscope
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HeroBackground } from '../landing/CompleteSimulation';

interface LoginProps {
  onLogin: (userData: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'parent' | 'therapist' | 'teacher' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'demo'>('login');

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        // Step 1: Send Magic Link for Verification
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { 
            data: { 
              full_name: name, 
              role: selectedRole || 'parent',
              has_password: false // Mark as needing password setup
            } 
          }
        });
        if (error) throw error;
        alert('Check your email for the verification link! Click it, then you can set your password.');
      } else {
        // Step 2: Login with Password for returning users
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !name || !email) return;
    setLoading(true);
    setTimeout(() => {
      onLogin({ uid: `u_${Date.now()}`, displayName: name, email, role: selectedRole });
    }, 800);
  };

  return (
    <div className="relative bg-[#080908] min-h-screen text-white font-sans selection:bg-curamind-green/40">
      
      {/* LUXURY HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center pt-20 px-6">
        <HeroBackground />
        
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"
        >
          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-9xl font-sora font-black tracking-tighter leading-[0.9] text-white">
                Simple.<br />
                <span className="text-curamind-green">Safe.</span><br />
                Shared.
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-medium max-w-lg leading-relaxed">
                We make it easy for parents, teachers, and doctors to work together for one child.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-4">
                 {[1, 2, 3, 4].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-curamind-void bg-curamind-rim" />)}
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-curamind-green">Trust by families worldwide</p>
            </motion.div>
          </div>

          {/* PREMIUM LOGIN CARD */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 md:p-16 rounded-[24px] lg:rounded-[64px] bg-white/[0.03] border border-white/10 backdrop-blur-[100px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-6 lg:space-y-10"
          >
            <div className="space-y-2">
                               <h2 className="text-2xl lg:text-4xl font-black tracking-tight text-white">
                 {mode === 'signup' ? 'Create Account' : mode === 'demo' ? 'Quick Demo' : 'Welcome Back'}
               </h2>
                               <p className="text-xs lg:text-base text-white/40 font-medium">
                 {mode === 'signup' ? 'Verify your email first. We will send you a secure link.' : mode === 'demo' ? 'No account needed. Jump in instantly.' : 'Enter your email and password.'}
               </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
              {(['login', 'signup', 'demo'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    mode === m ? 'bg-curamind-green text-white shadow-lg' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {m === 'login' ? 'Log In' : m === 'signup' ? 'Sign Up' : 'Demo'}
                </button>
              ))}
            </div>

            <form onSubmit={mode === 'demo' ? handleLocalLogin : handleSupabaseAuth} className="space-y-5">
              {/* Role picker — only for signup and demo */}
              <AnimatePresence>
                {(mode === 'signup' || mode === 'demo') && (
                  <motion.div
                    key="roles"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-3 overflow-hidden"
                  >
                    {[
                      { id: 'parent', label: 'Parent', icon: Home, color: 'green' },
                      { id: 'teacher', label: 'Teacher', icon: Briefcase, color: 'orange' },
                      { id: 'therapist', label: 'Doctor', icon: Shield, color: 'red' }
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`flex flex-col items-center gap-2 lg:gap-3 p-4 lg:p-6 rounded-[24px] lg:rounded-[28px] border-2 transition-all ${
                          selectedRole === role.id
                            ? `bg-curamind-${role.roleColor || role.color} border-curamind-${role.roleColor || role.color} scale-105 text-white`
                            : 'bg-white/5 border-white/5 hover:border-white/15 text-white/40'
                        }`}
                      >
                        <role.icon className="w-5 h-5 lg:w-7 lg:h-7" />
                        <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest">{role.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name — only for signup and demo */}
              <AnimatePresence>
                {(mode === 'signup' || mode === 'demo') && (
                  <motion.input
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl px-6 py-4 lg:px-8 lg:py-5 text-sm lg:text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
                  />
                )}
              </AnimatePresence>

              {/* Email — always shown */}
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl px-6 py-4 lg:px-8 lg:py-5 text-sm lg:text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
              />

              {/* Password — only for login mode */}
              <AnimatePresence>
                {mode === 'login' && (
                  <motion.input
                    key="password"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your Password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl px-6 py-4 lg:px-8 lg:py-5 text-sm lg:text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
                  />
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || (mode !== 'login' && !selectedRole)}
                className="w-full py-4 lg:py-6 rounded-2xl lg:rounded-[32px] bg-curamind-green text-white font-black text-base lg:text-xl flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40"
              >
                {loading ? 'Processing...' : mode === 'signup' ? 'Send Link' : mode === 'demo' ? 'Enter Demo' : 'Log In'}
                <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT HELPS SECTION */}
      <section className="relative z-10 py-48 px-6 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="max-w-3xl space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1.5 bg-curamind-green/10 text-curamind-green border border-curamind-green/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4"
            >
               Platform Philosophy
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-9xl font-black tracking-tight text-white leading-[0.9]"
            >
              How it <br />
              <span className="text-curamind-yellow">helps.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-white/40 font-medium leading-relaxed"
            >
              We gather everyone who helps your child into one simple circle. <br className="hidden lg:block" /> 
              No more confusion. Just clear, connected care.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
             {[
               {
                 title: "Daily Updates",
                 desc: "Parents can quickly share how the child is feeling. This helps teachers and doctors know exactly what to do when they start their day.",
                 icon: Home,
                 color: "green",
                 delay: 0.1
               },
               {
                 title: "Shared Safety",
                 desc: "If a child feels overwhelmed at school, everyone in the circle gets a nudge. You can share tips instantly to help them get back to being calm.",
                 icon: Shield,
                 color: "red",
                 delay: 0.2
               },
               {
                 title: "One Circle",
                 desc: "No more missed notes or long phone calls. Doctors, Teachers, and Parents all look at the same data to make the best decisions together.",
                 icon: Briefcase,
                 color: "orange",
                 delay: 0.3
               },
               {
                 title: "Better Days",
                 desc: "By working together, you create a more predictable world for your child. A predictable world is a safe world where they can grow.",
                 icon: Star,
                 color: "yellow",
                 delay: 0.4
               }
             ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: card.delay }}
                  whileHover={{ y: -10 }}
                  className="group relative p-8 lg:p-12 rounded-[48px] lg:rounded-[64px] bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500"
                >
                   {/* Background Glow */}
                   <div className={`absolute top-0 right-0 w-64 h-64 bg-curamind-${card.color}/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-curamind-${card.color}/10 transition-colors`} />
                   
                   <div className="relative z-10 space-y-10">
                      <div className={`w-24 h-24 bg-curamind-${card.color}/10 border border-curamind-${card.color}/20 rounded-[32px] flex items-center justify-center text-curamind-${card.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                         <card.icon className="w-12 h-12" />
                      </div>
                      <div className="space-y-6">
                         <h3 className="text-4xl font-black text-white tracking-tight">{card.title}</h3>
                         <p className="text-xl text-white/40 font-medium leading-relaxed group-hover:text-white/60 transition-colors">
                            {card.desc}
                         </p>
                      </div>
                   </div>

                   {/* Hover Border Glow */}
                   <div className={`absolute inset-0 border-2 border-curamind-${card.color}/0 group-hover:border-curamind-${card.color}/20 rounded-[64px] transition-all duration-500`} />
                </motion.div>
             ))}
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 -right-64 w-[600px] h-[600px] bg-curamind-green/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-64 w-[600px] h-[600px] bg-curamind-red/5 blur-[150px] rounded-full pointer-events-none" />
      </section>

      {/* FINAL CTA */}
      <section className="py-60 px-6 text-center relative overflow-hidden bg-curamind-void">
         <div className="max-w-4xl mx-auto space-y-16 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-tight"
            >
              Ready to <br />
              <span className="text-curamind-green">start helping?</span>
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-3xl text-white/40 font-medium"
            >
              Join the circle of caregivers who are changing the world for their kids.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-16 py-8 bg-white text-black font-black text-2xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
               Join the Circle
            </motion.button>
         </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="py-24 border-t border-white/5 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-curamind-green rounded-2xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
               </div>
               <span className="text-3xl font-black uppercase tracking-tighter text-white">curamind</span>
            </div>
            <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
               <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
               <span className="cursor-pointer hover:text-white transition-colors">Safety</span>
               <span className="cursor-pointer hover:text-white transition-colors">Contact</span>
            </div>
            <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
               © 2026 CURAMIND. PURE CARE.
            </div>
         </div>
      </footer>

    </div>
  );
};
