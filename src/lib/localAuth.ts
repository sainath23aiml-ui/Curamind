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

    // 2. Listen to Supabase Auth Changes with error handling
    let subscription: any = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const sbUser: LocalUser = {
            uid: session.user.id,
            displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: session.user.user_metadata.role || 'parent',
            hasPassword: session.user.user_metadata.has_password !== false
          };
          setUser(sbUser);
          localStorage.setItem(AUTH_KEY, JSON.stringify(sbUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(AUTH_KEY);
        }
        setLoading(false);
      });
      subscription = data?.subscription;
    } catch (e) {
      console.error('Supabase auth listener failed:', e);
      setLoading(false);
    }

    setLoading(false);

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = (userData: LocalUser) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    // 1. Clear local state immediately for instant UI feedback
    localStorage.removeItem(AUTH_KEY);
    setUser(null);

    // 2. Attempt remote signout in background (don't await)
    supabase.auth.signOut().catch(e => console.warn('Background signout failed:', e));

    // 3. Force reload immediately
    window.location.reload();
  };

  return { user, loading, login, logout };
};
