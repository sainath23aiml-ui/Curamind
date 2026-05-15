import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, MessageCircle, Phone, Mail, Plus, FileText, Siren, Activity } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { NoteCreator } from './NoteCreator';
import { SignalModal } from './SignalModal';

export const CareCircle = () => {
  const [showNoteCreator, setShowNoteCreator] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);
  const members = [
    { name: "Meena Iyer", role: "Parent (Admin)", online: true, color: "curamind-purple" },
    { name: "Dr. Meera S.", role: "Clinical Lead", online: true, color: "curamind-coral" },
    { name: "Mrs. Kavita", role: "Teacher", online: false, color: "curamind-gold" },
    { name: "Amit Iyer", role: "Parent", online: false, color: "curamind-purple" },
  ];

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
         <div>
                         <h3 className="text-2xl lg:text-3xl font-bold text-curamind-text">The Care Circle</h3>
                         <p className="text-sm lg:text-base text-curamind-muted font-medium mt-1">Everyone connected for support.</p>
         </div>
          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            <button 
              onClick={() => setShowSignalModal(true)}
              className="flex-1 lg:flex-none px-5 py-3 lg:px-6 lg:py-4 bg-curamind-coral text-white rounded-2xl font-extrabold flex items-center justify-center gap-2 lg:gap-3 shadow-xl shadow-curamind-coral/30 hover:scale-[1.02] active:scale-95 transition-all text-xs lg:text-base"
            >
               <Siren className="w-4 h-4 lg:w-5 lg:h-5 animate-pulse" /> Care Signal
            </button>
            <button 
              onClick={() => setShowNoteCreator(true)}
              className="flex-1 lg:flex-none px-5 py-3 lg:px-6 lg:py-4 bg-white border-2 border-curamind-purple/20 text-curamind-purple rounded-2xl font-extrabold flex items-center justify-center gap-2 lg:gap-3 transition-all hover:border-curamind-purple active:scale-95 text-xs lg:text-base"
            >
               <FileText className="w-4 h-4 lg:w-5 lg:h-5" /> Share Note
            </button>
            <button className="flex-1 lg:flex-none px-5 py-3 lg:px-6 lg:py-4 bg-curamind-purple text-white rounded-2xl font-extrabold flex items-center justify-center gap-2 lg:gap-3 shadow-xl shadow-curamind-purple/20 hover:scale-[1.02] active:scale-95 transition-all text-xs lg:text-base">
               <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Invite
            </button>
          </div>
      </div>

      <SignalModal isOpen={showSignalModal} onClose={() => setShowSignalModal(false)} childId="default-child" />

      <AnimatePresence>
        {showNoteCreator && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <NoteCreator childId="default-child" onCancel={() => setShowNoteCreator(false)} />
          </motion.div>
        )}
      </AnimatePresence>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {members.map((member, i) => (
          <GlassCard key={i} className="text-center group p-8 lg:p-10 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-[40px] bg-curamind-faint flex items-center justify-center border-4 border-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                <User className="w-10 h-10 text-curamind-muted" />
              </div>
              {member.online && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-curamind-purple rounded-full border-4 border-white flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
            <h4 className="text-xl font-bold text-curamind-text">{member.name}</h4>
            <div className={`text-[10px] uppercase tracking-[0.2em] font-extrabold mt-1 text-${member.color}`}>
              {member.role}
            </div>
            
            <div className="flex gap-4 mt-8 opacity-0 group-hover:opacity-100 transition-all">
              <button className="p-3 bg-curamind-faint rounded-xl hover:bg-curamind-purple hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="p-3 bg-curamind-faint rounded-xl hover:bg-curamind-purple hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        <div className="bg-white/5 p-6 lg:p-12 rounded-[32px] lg:rounded-[48px] border border-white/10 text-white relative overflow-hidden">
          <h4 className="text-xl lg:text-2xl font-bold mb-6 flex items-center gap-3">
             <Activity className="w-6 h-6 text-curamind-green" /> 
             Collaborative Pulse
          </h4>
          <div className="space-y-6 relative z-10">
             {[
               { user: "Mrs. Kavita", action: "Updated School Sensory Profile", time: "2h ago" },
               { user: "Dr. Meera", action: "Refined Sleep Protocol for Arjun", time: "5h ago" },
               { user: "Meena", action: "Logged Meltdown Event (Resolved)", time: "Yesterday" }
             ].map((activity, i) => (
               <div key={i} className="flex gap-4 p-4 lg:p-5 bg-white/10 rounded-[24px] lg:rounded-[32px] border border-white/10 text-xs lg:text-sm">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {activity.user[0]}
                  </div>
                  <div>
                    <div className="font-bold">{activity.user} <span className="font-medium text-white/60">{activity.action}</span></div>
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{activity.time}</div>
                  </div>
               </div>
             ))}
          </div>
         </div>
 
        <div className="bg-white/5 p-6 lg:p-12 rounded-[32px] lg:rounded-[48px] border border-white/10">
          <h4 className="text-xl lg:text-2xl font-bold mb-8 flex items-center gap-3 text-white">
             <Activity className="w-6 h-6 text-curamind-yellow" /> Shared Goals
          </h4>
          <div className="space-y-8">
             {[
               { label: "Morning Routine Mastery", prog: 75, color: "curamind-teal" },
               { label: "Eye Contact (with Peers)", prog: 40, color: "curamind-purple" },
               { label: "Asking for Sanctuary", prog: 90, color: "curamind-gold" }
             ].map((goal, i) => (
               <div key={i} className="space-y-3">
                 <div className="flex justify-between text-sm font-bold text-curamind-text">
                    <span>{goal.label}</span>
                    <span>{goal.prog}%</span>
                 </div>
                 <div className="h-4 bg-curamind-faint rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.prog}%` }}
                      className={`h-full bg-${goal.color}`}
                    />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
