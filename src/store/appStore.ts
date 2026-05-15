import { create } from 'zustand';
import { Child, User } from '../lib/types';

interface UserState {
  user: User | null;
  role: 'parent' | 'therapist' | 'teacher' | null;
  setUser: (user: User | null) => void;
  setRole: (role: 'parent' | 'therapist' | 'teacher' | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  logout: () => set({ user: null, role: null }),
}));

interface ChildState {
  children: Child[];
  activeChildId: string | null;
  setChildren: (children: Child[]) => void;
  setActiveChildId: (id: string | null) => void;
  getActiveChild: () => Child | null;
}

export const useChildStore = create<ChildState>((set, get) => ({
  children: [],
  activeChildId: null,
  setChildren: (children) => set({ children }),
  setActiveChildId: (activeChildId) => set({ activeChildId }),
  getActiveChild: () => {
    const { children, activeChildId } = get();
    return children.find(c => c.id === activeChildId) || children[0] || null;
  },
}));
