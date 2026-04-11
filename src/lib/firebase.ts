import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNVvwh8KYi-n0CA84CTn45LwK0NfUdX4Y",
  authDomain: "pfe-fstsbz2025-2026.firebaseapp.com",
  projectId: "pfe-fstsbz2025-2026",
  storageBucket: "pfe-fstsbz2025-2026.firebasestorage.app",
  messagingSenderId: "547495791246",
  appId: "1:547495791246:web:91b182330aebde07b157df"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to emulators in development if needed
if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export default app;
