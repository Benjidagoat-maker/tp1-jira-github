import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNVvwh8KYi-n0CA84CTn45LwK0NfUdX4Y",
  authDomain: "pfe-fstsbz2025-2026.firebaseapp.com",
  projectId: "pfe-fstsbz2025-2026",
  storageBucket: "pfe-fstsbz2025-2026.firebasestorage.app",
  messagingSenderId: "547495791246",
  appId: "1:547495791246:web:91b182330aebde07b157df"
};

// Initialize Firebase — App Check is NOT initialized here.
// If App Check was enabled in the Firebase console, go to:
//   Firebase Console → App Check → your web app → toggle "Enforce" OFF
//   or add localhost / your Vercel domain to the allowed origins.
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;