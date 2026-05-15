/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface LocalUser {
  uid: string;
  displayName: string;
  email: string;
  role: 'parent' | 'therapist' | 'teacher';
  hasPassword?: boolean;
}

const AUTH_KEY = 'curamind_local_user';

export const useLocalAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for legacy local storage user (useful for demo mode)
    const savedUser = localStorage.getItem(AUTH_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Listen to Supabase Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // If we have a Supabase user, we prioritize it
        const sbUser: LocalUser = {
          uid: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: session.user.user_metadata.role || 'parent',
          hasPassword: session.user.user_metadata.has_password !== false // Default to true unless explicitly false
        };
        setUser(sbUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(sbUser));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(AUTH_KEY);
      }
      setLoading(false);
    });

    setLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: LocalUser) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  };

  return { user, loading, login, logout };
};
