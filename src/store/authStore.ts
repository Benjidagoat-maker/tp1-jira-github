import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
  logout: () => void;
}

const roleNames: Record<Role, string> = {
  etudiant: 'Ahmed Ben Salah',
  tuteur: 'Dr. Sami Trabelsi',
  coordinateur: 'Prof. Leila Mansouri',
  jury: 'Dr. Karim Jebali',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    { name: 'auth-store' }
  )
);
