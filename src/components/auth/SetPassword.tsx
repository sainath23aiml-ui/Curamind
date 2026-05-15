import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, CheckCircle2, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const SetPassword: React.FC<{ onComplete: () => void; onLogout: () => void }> = ({ onComplete, onLogout }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
        data: { has_password: true }
      });
      if (error) throw error;
      setFinished(true);
      setTimeout(onComplete, 2000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (finished) {
    return (
      <div className="fixed inset-0 z-[200] bg-curamind-void flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 bg-curamind-green/20 rounded-full flex items-center justify-center mx-auto text-curamind-green animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-white">Password Set!</h2>
          <p className="text-white/40">You are ready to enter the sanctuary.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-curamind-void/90 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full p-12 rounded-[48px] bg-white/[0.03] border border-white/10 shadow-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-curamind-green/10 rounded-2xl flex items-center justify-center mx-auto text-curamind-green">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white">Secure Your Account</h2>
          <p className="text-white/40 text-sm">Now that you've verified your email, please set a password for future logins.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
            />
            <input 
              required
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold focus:outline-none focus:border-curamind-green/50 transition-all text-white placeholder:text-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[24px] bg-curamind-green text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? "Saving..." : "Set Password"}
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-4 text-xs font-bold text-white/40 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </form>
      </motion.div>
    </div>
  );
};
