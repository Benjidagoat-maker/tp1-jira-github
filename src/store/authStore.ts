import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: Role) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as Omit<User, 'id'>;
              set({
                user: { id: firebaseUser.uid, ...userData },
                firebaseUser,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // User exists in Auth but not in Firestore
              set({
                firebaseUser,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            set({
              user: null,
              firebaseUser: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });
        return unsubscribe;
      },

      login: async (email: string, password: string, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            // Verify role matches
            if (userData.role !== role) {
              await signOut(auth);
              throw new Error(`Vous n'avez pas le rôle "${role}". Votre rôle est "${userData.role}".`);
            }
            set({
              user: { id: firebaseUser.uid, ...userData },
              firebaseUser,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Create user document if it doesn't exist
            const newUser: Omit<User, 'id'> = {
              name: firebaseUser.displayName || email.split('@')[0],
              email: firebaseUser.email || email,
              role,
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            set({
              user: { id: firebaseUser.uid, ...newUser },
              firebaseUser,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;

          // Create user document in Firestore
          const newUser: Omit<User, 'id'> = {
            name,
            email: firebaseUser.email || email,
            role,
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

          set({
            user: { id: firebaseUser.uid, ...newUser },
            firebaseUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Erreur lors de l\'inscription';
          if (error instanceof Error) {
            if (error.message.includes('email-already-in-use')) {
              errorMessage = 'Cette adresse email est déjà utilisée';
            } else if (error.message.includes('weak-password')) {
              errorMessage = 'Le mot de passe est trop faible';
            } else if (error.message.includes('invalid-email')) {
              errorMessage = 'Adresse email invalide';
            } else {
              errorMessage = error.message;
            }
          }
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(auth);
          set({
            user: null,
            firebaseUser: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
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
