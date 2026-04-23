import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  loginWithGitHub: (role: Role) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      loginWithGitHub: async (role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
              redirectTo: `${window.location.origin}/dashboard`,
              queryParams: { role },
            },
          });
          if (error) throw error;
          // OAuth flow redirects away; keep loading state until auth listener updates.
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Erreur de connexion GitHub';
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      initializeAuth: () => {
        // Check current session immediately
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              .then(async ({ data }) => {
                if (data) {
                  set({
                    user: { id: session.user.id, ...data },
                    isAuthenticated: true,
                    isLoading: false,
                  });
                  return;
                }

                // If profile doesn't exist (e.g., first OAuth login), create one.
                const metadata = session.user.user_metadata ?? {};
                const email = session.user.email ?? '';
                const name =
                  (typeof metadata.full_name === 'string' && metadata.full_name) ||
                  (typeof metadata.name === 'string' && metadata.name) ||
                  email.split('@')[0] ||
                  'Utilisateur';
                const roleParam = new URLSearchParams(window.location.search).get('role');
                const role: Role =
                  roleParam === 'etudiant' ||
                  roleParam === 'tuteur' ||
                  roleParam === 'coordinateur' ||
                  roleParam === 'jury'
                    ? roleParam
                    : 'etudiant';

                const { data: createdProfile } = await supabase
                  .from('profiles')
                  .upsert({ id: session.user.id, name, email, role })
                  .select('*')
                  .single();

                if (createdProfile) {
                  set({
                    user: { id: session.user.id, ...createdProfile },
                    isAuthenticated: true,
                    isLoading: false,
                  });
                } else {
                  set({ user: null, isAuthenticated: false, isLoading: false });
                }
              });
          } else {
            set({ isAuthenticated: false, isLoading: false });
          }
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (session?.user) {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              if (data) {
                set({
                  user: { id: session.user.id, ...data },
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                const metadata = session.user.user_metadata ?? {};
                const email = session.user.email ?? '';
                const name =
                  (typeof metadata.full_name === 'string' && metadata.full_name) ||
                  (typeof metadata.name === 'string' && metadata.name) ||
                  email.split('@')[0] ||
                  'Utilisateur';
                const roleParam = new URLSearchParams(window.location.search).get('role');
                const role: Role =
                  roleParam === 'etudiant' ||
                  roleParam === 'tuteur' ||
                  roleParam === 'coordinateur' ||
                  roleParam === 'jury'
                    ? roleParam
                    : 'etudiant';

                const { data: createdProfile } = await supabase
                  .from('profiles')
                  .upsert({ id: session.user.id, name, email, role })
                  .select('*')
                  .single();

                if (createdProfile) {
                  set({
                    user: { id: session.user.id, ...createdProfile },
                    isAuthenticated: true,
                    isLoading: false,
                  });
                } else {
                  set({ user: null, isAuthenticated: false, isLoading: false });
                }
              }
            } else {
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          }
        );

        return () => subscription.unsubscribe();
      },

      login: async (email: string, password: string, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          if (!data.user) throw new Error('Connexion échouée');

          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError || !profile) {
            throw new Error('Profil introuvable');
          }

          // Verify role
          if (profile.role !== role) {
            await supabase.auth.signOut();
            throw new Error(
              `Vous n'avez pas le rôle "${role}". Votre rôle est "${profile.role}".`
            );
          }

          set({
            user: { id: data.user.id, ...profile },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let msg = 'Erreur de connexion';
          if (error instanceof Error) {
            if (error.message.includes('Invalid login credentials'))
              msg = 'Email ou mot de passe incorrect';
            else if (error.message.includes('Email not confirmed'))
              msg = 'Veuillez confirmer votre email avant de vous connecter';
            else
              msg = error.message;
          }
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, role },
            },
          });
          if (error) throw error;
          if (!data.user) throw new Error("Échec de la création du compte");

          // Profile is auto-created by the DB trigger.
          // But we also upsert manually in case trigger is slow.
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name,
            email,
            role,
          });

          set({
            user: { id: data.user.id, name, email, role },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let msg = "Erreur lors de l'inscription";
          if (error instanceof Error) {
            if (error.message.includes('User already registered'))
              msg = 'Cette adresse email est déjà utilisée';
            else if (error.message.includes('Password should be'))
              msg = 'Le mot de passe est trop faible (min. 6 caractères)';
            else
              msg = error.message;
          }
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
