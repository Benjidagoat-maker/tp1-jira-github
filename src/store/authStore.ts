import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
  checkAuth: () => (() => void) | undefined; // ← Add this type
}

const roleNames: Record<Role, string> = {
  etudiant: 'Ahmed Ben Salah',
  tuteur: 'Dr. Sami Trabelsi',
  coordinateur: 'Prof. Leila Mansouri',
  jury: 'Dr. Karim Jebali',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, role: Role) => {
        const user: User = {
          id: crypto.randomUUID(),
          name: roleNames[role],
          email,
          role,
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      
      // ← Add this checkAuth function
      checkAuth: () => {
        // Check if user exists in persisted storage on mount
        const state = get();
        if (state.user && state.isAuthenticated) {
          // Optionally validate token/session here
          return; // No cleanup needed
        }
        // If no valid session, you could auto-logout or redirect
        return () => {}; // Return noop cleanup function
      },
    }),
    { name: 'auth-store' }
  )
);