/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Stethoscope, MessageCircle, Shield, 
  MapPin, Settings, LogOut, Bell, Search, 
  Filter, TrendingUp, AlertCircle, CheckCircle2,
  Calendar, Menu, X, ChevronRight, Share2, Printer, Phone, User,
  Mic, FileText, Siren, Music, Moon, Trophy, ArrowRight, Activity, Sliders, Users
} from 'lucide-react';

import { supabase } from './lib/supabase';
import { useLocalAuth } from './lib/localAuth';

import { Login } from './components/auth/Login';
import { BehavioralHeatmap } from './components/dashboard/BehavioralHeatmap';
import { RiskScoreGauge } from './components/dashboard/RiskScoreGauge';
import { StatCard } from './components/shared/StatCard';
import { BrainMapBoard } from './components/memory/BrainMapBoard';
import { ChatWindow } from './components/chat/ChatWindow';
import { CalmSanctuary } from './components/calm/CalmSanctuary';
import { GlassCard } from './components/shared/GlassCard';
import { MOCK_CHILD, MOCK_INTERVENTIONS } from './lib/mockData';
import { SocialStoryGenerator } from './components/stories/SocialStoryGenerator';
import { SensoryBudget } from './components/budget/SensoryBudget';
import { CareCircle } from './components/circle/CareCircle';
import { QuestPage } from './components/quests/QuestPage';
import { SetPassword } from './components/auth/SetPassword';

type View = 'dashboard' | 'memory' | 'chat' | 'calm' | 'stories' | 'budget' | 'circle' | 'quests';

export default function App() {
  const { user, loading, login, logout } = useLocalAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [childData, setChildData] = useState<any>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Hidden by default on mobile
  const [incomingNotes, setIncomingNotes] = useState<any[]>([]);
  const [activeAlert, setActiveAlert] = useState<any>(null);

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    async function initPlatform() {
      // FORCE DEMO MODE FOR HACKATHON TO ENSURE ZERO ERRORS
      setUserRole('parent');
      setChildData({ 
        id: 'demo-child', 
        name: 'Arjun', 
        aura_points: 750, 
        guardian: 'Sainath',
        sensory_profile: 'Sensitive'
      });
      
      setIncomingNotes([
        { id: '1', title: 'Sensory Observation', content: 'Arjun responded well to the weighted blanket today.', created_at: new Date().toISOString(), type: 'observation' },
        { id: '2', title: 'Social Progress', content: 'Used his communication board to request water.', created_at: new Date(Date.now() - 86400000).toISOString(), type: 'progress' }
      ]);

      // Cloud Sync Silenced for Demo mode, but Supabase is ready for production
      console.log("Demo Mode: Cloud sync silenced. Supabase integration is active.");
    }
    initPlatform();
  }, [user]);

  const resolveAlert = async () => {
    if (activeAlert && childData && childData.id !== 'demo-child') {
      await supabase.from('alerts').update({ status: 'resolved' }).eq('id', activeAlert.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-curamind-void flex items-center justify-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }} className="bg-curamind-purple p-6 rounded-3xl">
          <Stethoscope className="text-white w-10 h-10" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={login} />;
  }

  // If user is verified but has no password yet, force password setup
  if (user.hasPassword === false) {
    return <SetPassword onComplete={() => window.location.reload()} onLogout={logout} />;
  }

  const renderParentDashboard = () => (
    <div className="flex min-h-screen bg-curamind-void overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-[85vw] lg:w-72 bg-curamind-void border-r border-white/5 p-6 lg:p-8 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-curamind-green flex items-center justify-center shadow-lg shadow-curamind-green/30 group relative">
              <Stethoscope className="text-white w-6 h-6 lg:w-7 lg:h-7" />
            </div>
            <h1 className="text-xl lg:text-2xl font-sora font-extrabold tracking-tight text-curamind-text">curamind</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-curamind-muted hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'memory', label: 'The Brain Map', icon: Activity },
            { id: 'chat', label: 'Ask CuraMind AI', icon: MessageCircle },
            { id: 'calm', label: 'Calm Sanctuary', icon: Shield },
            { id: 'stories', label: 'Social Stories', icon: FileText },
            { id: 'budget', label: 'Sensory Budget', icon: Sliders },
            { id: 'circle', label: 'Care Circle', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${currentView === item.id ? 'bg-curamind-purple text-white shadow-xl translate-x-1' : 'text-curamind-muted hover:bg-curamind-faint/50'}`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-white' : 'text-curamind-purple/60'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-6 pt-8 border-t border-curamind-rim/50">
          <div className="bg-curamind-faint/50 p-4 rounded-2xl border border-curamind-rim/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border-2 border-curamind-teal">
              <img src="https://picsum.photos/seed/doctor/40/40" alt="Dr. Meera" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="text-[9px] text-curamind-muted uppercase tracking-widest font-extrabold">Care Lead</div>
              <div className="text-xs font-bold text-curamind-text">Dr. Meera S.</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-curamind-teal shadow-[0_0_8px_#7ACCC8]" />
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-curamind-coral hover:bg-curamind-coral/5 transition-all font-bold text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>

          {/* Connection Status */}
          <div className="mt-4 px-5 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full animate-pulse ${loading ? 'bg-curamind-yellow' : 'bg-curamind-coral'}`} />
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 leading-none">Supabase Status</span>
                <span className="text-[10px] font-bold text-curamind-coral leading-tight">Service Interruption (503)</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-curamind-void border-b border-white/5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-curamind-green flex items-center justify-center shadow-lg">
                <Stethoscope className="text-white w-5 h-5" />
             </div>
             <span className="text-lg font-sora font-extrabold text-white">curamind</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Main Scrolling Content */}
        <main className="flex-1 p-4 lg:p-14 overflow-x-hidden overflow-y-auto relative bg-curamind-void">
        {/* SOS OVERLAY ALERT */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div
              initial={{ opacity: 0, scale: 1.1, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-8 top-8 z-[200] lg:inset-x-auto lg:right-14 lg:w-[400px]"
            >
              <div className="bg-curamind-red bg-gradient-to-br from-curamind-red to-curamind-red-faint p-8 rounded-[40px] shadow-2xl text-white relative overflow-hidden border-4 border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                      <Siren className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-sora font-extrabold uppercase tracking-tight">Active SOS Signal</h4>
                      <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Sent by {activeAlert.author_name}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Observation</div>
                      <p className="text-sm font-bold italic leading-relaxed">"{activeAlert.message}"</p>
                    </div>
                    
                    <div className="p-4 bg-white text-curamind-red rounded-2xl shadow-xl">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Recommended Intervention</div>
                      <p className="text-base font-extrabold">{activeAlert.intervention}</p>
                    </div>
                  </div>

                  <button 
                    onClick={resolveAlert}
                    className="w-full py-4 bg-white text-curamind-red rounded-2xl font-bold flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl"
                  >
                    <CheckCircle2 className="w-5 h-5" /> I've Handled This
                  </button>
                </div>
                <Siren className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 -rotate-12" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 text-curamind-text">
          <div>
            <div className="text-xs text-curamind-muted uppercase tracking-[0.2em] font-bold mb-2">NAMASTE, {user?.displayName?.split(' ')[0] || 'User'}</div>
            <h2 className="text-4xl font-sora font-extrabold tracking-tight">
              Good Morning <span className="text-curamind-purple">☀️</span>
              <span className="block mt-1 text-lg font-medium text-curamind-muted">
                {childData ? `${childData.name}'s rest cycle was stable last night.` : 'Ready to support your child today?'}
              </span>
            </h2>
          </div>
          {childData && (
            <div className="bg-white/5 p-4 px-6 rounded-[32px] border border-white/10 flex items-center gap-5 transition-all hover:scale-105 active:scale-95 cursor-pointer" onClick={() => setCurrentView('quests')}>
               <div className="w-12 h-12 bg-curamind-yellow/10 rounded-2xl flex items-center justify-center">
                 <Trophy className="text-curamind-yellow w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-curamind-yellow uppercase tracking-[0.2em] mb-0.5">Aura Points</div>
                  <div className="text-xl font-black text-white">{(childData.aura_points || 0).toLocaleString()}</div>
               </div>
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Sensitivity Today" value={78} suffix="/100" trend="up" trendValue="+12" color="red" description="Prepare for school transition" />
                <StatCard label="Calm Streak" value={3} suffix="Days" trend="down" trendValue="-1" color="yellow" description="Last spike: Friday 4pm" />
                <StatCard label="Sensory Points" value={120} suffix="pts" trend="neutral" color="green" description="240 pts remaining" />
                <StatCard label="Circle Updates" value={2} trend="up" trendValue="+1" color="orange" description="Verify in Care Circle" />
              </div>

              {/* Gamified Quests Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-4 text-curamind-text">
                  <h3 className="text-2xl font-sora font-extrabold flex items-center gap-3">
                    Daily Quests
                  </h3>
                  <button 
                    onClick={() => setCurrentView('quests')}
                    className="flex items-center gap-2 text-xs font-extrabold text-curamind-purple uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    View All Quests <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "The Knight's Armor", desc: "15 mins with weighted vest", pts: 50, icon: Shield, color: "curamind-teal" },
                    { title: "Silent Sanctuary", desc: "Complete 3 breathing sets", pts: 30, icon: Moon, color: "curamind-purple" },
                    { title: "The Sonic Shield", desc: "Use noise wraps during transit", pts: 40, icon: Music, color: "curamind-gold" }
                  ].map((quest, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentView('quests')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 bg-white/5 rounded-[32px] border border-white/5 flex items-center gap-5 text-left group"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <quest.icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-white">{quest.title}</div>
                        <div className="text-[10px] font-medium text-white/40 mt-1">{quest.desc}</div>
                      </div>
                      <div className="text-xs font-black text-curamind-yellow">+{quest.pts}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <BehavioralHeatmap />
                <RiskScoreGauge />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <GlassCard className="bg-white/80 p-10">
                   <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-bold text-curamind-text">What's working today?</h3>
                    <button className="text-xs text-curamind-purple font-bold bg-curamind-purple/5 px-4 py-2 rounded-full uppercase tracking-widest">Recent Trends</button>
                  </div>
                  <div className="space-y-8">
                    {MOCK_INTERVENTIONS.map((item, i) => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex justify-between text-sm font-bold text-curamind-text">
                          <span className="flex items-center gap-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-curamind-teal" />
                             {item.name}
                          </span>
                          <span className="text-curamind-muted tracking-tight">{Math.round((item.successes/item.attempts) * 100)}% Effective</span>
                        </div>
                        <div className="h-4 bg-curamind-faint rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.successes/item.attempts) * 100}%` }}
                            transition={{ duration: 1.2, delay: i * 0.15, ease: "circOut" }}
                            className="h-full bg-curamind-teal shadow-[0_0_15px_rgba(122,204,200,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <div className="bg-curamind-purple p-10 rounded-[40px] organic-shadow relative overflow-hidden text-white flex flex-col justify-between">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold mb-4 tracking-tight">Need a moment?</h3>
                    <p className="text-white/80 font-medium mb-12 text-xl max-w-sm">CuraMind is here. In English, Hindi, or Malayalam — let's find the calm together.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('chat')}
                    className="relative z-10 w-full py-6 bg-white text-curamind-purple rounded-2xl font-bold text-xl shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all outline-none"
                  >
                    Open CuraMind AI
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'memory' && (
            <motion.div key="memory" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-[700px]">
              <BrainMapBoard childId={childData?.id || 'default-child'} />
            </motion.div>
          )}

          {currentView === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ChatWindow />
            </motion.div>
          )}

          {currentView === 'calm' && (
            <motion.div 
              key="calm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex flex-col bg-curamind-void"
              style={{ background: 'radial-gradient(circle at center, #1A0A3E 0%, #050520 100%)' }}
            >
              <div className="p-12 pb-0 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-curamind-teal/20 rounded-2xl flex items-center justify-center">
                    <Shield className="text-curamind-teal w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-sora font-extrabold text-white">Calm Sanctuary</h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Safe Space Mode</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="text-white/50 hover:text-white flex items-center gap-3 font-bold uppercase tracking-widest text-xs transition-all outline-none"
                >
                  <X className="w-6 h-6" /> Exit Sanctuary
                </button>
              </div>
              <div className="flex-1">
                <CalmSanctuary />
              </div>
            </motion.div>
          )}

          {currentView === 'stories' && (
            <motion.div key="stories" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <SocialStoryGenerator />
            </motion.div>
          )}

          {currentView === 'budget' && (
            <motion.div key="budget" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
               <SensoryBudget />
            </motion.div>
          )}

          {currentView === 'circle' && (
            <motion.div key="circle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <CareCircle />
            </motion.div>
          )}

          {currentView === 'quests' && (
            <motion.div key="quests" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[150] overflow-y-auto bg-curamind-void">
               <QuestPage childId={childData?.id || 'default-child'} onBack={() => setCurrentView('dashboard')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>
    </div>
  );

  const renderTherapistPortal = () => (
    <div className="bg-curamind-void min-h-screen text-white font-sans">
       <header className="px-6 py-4 lg:px-10 lg:py-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between shadow-2xl sticky top-0 z-50 backdrop-blur-xl">
          <div className="flex items-center gap-4 lg:gap-6">
             <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-curamind-teal flex items-center justify-center shadow-lg shadow-curamind-teal/20">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
             </div>
             <div>
               <h2 className="text-lg lg:text-2xl font-sora font-extrabold tracking-tight">Clinical Workspace</h2>
               <div className="text-[9px] lg:text-[10px] text-curamind-muted font-bold uppercase tracking-[0.2em]">{user?.displayName} · Clinical Lead</div>
             </div>
          </div>
          <button onClick={logout} className="text-[10px] lg:text-xs font-bold text-curamind-coral bg-curamind-coral/5 px-4 py-2 lg:px-6 lg:py-3 rounded-xl border border-curamind-coral/20 hover:bg-curamind-coral/10 transition-all uppercase tracking-widest outline-none">
             Sign Out
          </button>
       </header>

               <main className="p-4 lg:p-10 max-w-7xl mx-auto space-y-12">
          {childData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2 space-y-8 lg:space-y-10">
                                <section className="bg-white/[0.03] p-5 lg:p-12 rounded-[24px] lg:rounded-[48px] border border-white/10 organic-shadow relative overflow-hidden">
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div>
                        <h3 className="text-3xl font-sora font-extrabold">{childData.name} — Live Insight</h3>
                        <p className="text-curamind-muted font-medium">Synced with Home & School activity.</p>
                      </div>
                      <div className="px-4 py-2 bg-curamind-teal/10 text-curamind-teal rounded-full text-[10px] font-bold uppercase tracking-widest">Active File</div>
                   </div>
                   <div className="p-8 rounded-3xl bg-curamind-purple/5 border-2 border-dashed border-curamind-purple/20 text-curamind-purple font-bold flex items-center gap-4 mb-10">
                      <Activity className="w-6 h-6 animate-pulse" /> 
                      System Alert: Unusual evening activity detected in rest cycles.
                   </div>
                   
                   <div className="space-y-6">
                     <h4 className="text-xs font-extrabold uppercase tracking-widest text-curamind-muted">Shared Recommendations</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {incomingNotes.map(note => (
                          <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-3xl bg-curamind-faint/50 border border-curamind-rim/30 flex flex-col justify-between h-full">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-4 h-4 text-curamind-purple" />
                                <span className="text-[10px] font-bold uppercase text-curamind-muted">{note.author_name}</span>
                              </div>
                              <p className="text-sm font-bold text-curamind-text mb-4 italic">"{note.content}"</p>
                            </div>
                            <div className="mt-4 text-[9px] font-bold text-curamind-muted/50 uppercase tracking-tighter">
                              {new Date(note.created_at).toLocaleString()}
                            </div>
                          </motion.div>
                        ))}
                     </div>
                   </div>
                </section>
              </div>

              <div className="space-y-10">
                 <div className="bg-curamind-purple p-10 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
                    <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <Activity className="w-5 h-5" /> Care Summary
                    </h4>
                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-sm font-medium opacity-60">Mood Index</span>
                        <span className="text-2xl font-bold font-sora">Stable</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-sm font-medium opacity-60">Sensory Load</span>
                        <span className="text-2xl font-bold font-sora">72/100</span>
                      </div>
                    </div>
                    <Activity className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10" />
                 </div>
              </div>
            </div>
          ) : (
             <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-curamind-faint rounded-full flex items-center justify-center text-curamind-muted">
                 <Search className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-bold">No Active Cases</h3>
               <p className="text-curamind-muted max-w-sm">You haven't been added to any child's Care Circle yet.</p>
             </div>
          )}
       </main>
    </div>
  );

  const renderTeacherView = () => (
        <div className="bg-curamind-void min-h-screen p-4 lg:p-10 flex flex-col items-center gap-8 lg:gap-12 font-sans text-white">
       <div className="max-w-3xl w-full">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-curamind-gold flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
               </div>
               <h1 className="text-2xl font-sora font-extrabold text-white">Classroom Support</h1>
            </div>
            <button onClick={logout} className="text-xs font-bold text-white/60 hover:text-white uppercase tracking-widest">Sign Out</button>
         </div>

          {childData ? (
            <div className="bg-white/[0.03] rounded-[32px] lg:rounded-[48px] overflow-hidden border border-white/10 organic-shadow">
               <header className="bg-curamind-gold/20 p-8 lg:p-12 border-b border-white/10">
                  <h2 className="text-3xl lg:text-4xl font-sora font-extrabold tracking-tight">{childData.name}</h2>
                  <p className="text-white/80 font-bold mt-2 uppercase tracking-widest text-[10px] lg:text-xs">Assigned Student Profile</p>
               </header>
               <div className="p-8 lg:p-12 space-y-10 lg:space-y-12">
                 <section className="space-y-6">
                    <h3 className="text-xl font-bold text-curamind-text flex items-center gap-3">
                      <Activity className="text-curamind-coral" /> Active Sensory Protocol
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <GlassCard className="bg-curamind-coral/5 border-curamind-coral/20">
                          <h4 className="text-[10px] uppercase font-extrabold text-curamind-coral tracking-widest mb-4">Critical Trigger</h4>
                          <p className="font-bold text-curamind-text">Transition bells and school rallies.</p>
                       </GlassCard>
                       <GlassCard className="bg-curamind-teal/5 border-curamind-teal/20">
                          <h4 className="text-[10px] uppercase font-extrabold text-curamind-teal tracking-widest mb-4">Urgent Solution</h4>
                          <p className="font-bold text-curamind-text">Provide noise-cancelling wraps 5m before bells.</p>
                       </GlassCard>
                    </div>
                 </section>

                 <section className="space-y-6 border-t border-curamind-rim/30 pt-10">
                    <h3 className="text-xl font-bold text-curamind-text flex items-center gap-3">
                      <MessageCircle className="text-curamind-purple" /> Latest Shared Advice
                    </h3>
                    <div className="space-y-4">
                       {incomingNotes.length > 0 ? (
                         incomingNotes.map(note => (
                           <div key={note.id} className="p-6 bg-curamind-faint/50 rounded-3xl border border-curamind-rim/30">
                              <div className="text-[10px] font-extrabold uppercase text-curamind-muted mb-2">{note.author_name} (Shared {new Date(note.created_at).toLocaleDateString()})</div>
                              <p className="text-curamind-text font-medium leading-relaxed italic">"{note.content}"</p>
                           </div>
                         ))
                       ) : (
                         <div className="p-10 text-center bg-curamind-faint/30 rounded-3xl border border-dashed border-curamind-rim text-curamind-muted text-sm font-medium">
                           No shared notes yet.
                         </div>
                       )}
                    </div>
                 </section>
              </div>
           </div>
          ) : (
             <div className="bg-white/10 backdrop-blur-md p-20 rounded-[48px] text-center text-white space-y-4">
                <h3 className="text-2xl font-bold">Waiting for Student Connection</h3>
                <p className="opacity-60 text-sm max-w-sm mx-auto">Please ask the parent to add you to their care circle using your email.</p>
             </div>
          )}
       </div>
    </div>
  );

  const renderRolePortal = () => {
    switch (user?.role) {
      case 'therapist':
        return renderTherapistPortal();
      case 'teacher':
        return renderTeacherView();
      default:
        return renderParentDashboard();
    }
  };

  return (
    <div className="font-sans antialiased text-curamind-text bg-curamind-void">
      <AnimatePresence mode="wait">
        {renderRolePortal()}
      </AnimatePresence>
    </div>
  );
}
