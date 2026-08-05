import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyCtzvS19slrAH1Ns6x5BL6fLrJ5OuAczKE",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "velfound-d7c7d.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "velfound-d7c7d",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "velfound-d7c7d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "967891413630",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:967891413630:web:efcb7ef10341f116a2462f",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "G-GCYTEBV4YJ",
};

export const isFirebaseConfigured = () =>
  Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

// Initialize app (singleton-safe)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use session persistence to avoid Chrome's IndexedDB "Database is closing/hidden" error.
// Session persistence stores the token in sessionStorage (no IndexedDB), which is safe
// across HMR reloads and tab-visibility changes.
const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence).catch(() => {});

const db = getFirestore(app);

// Analytics — only loaded in browser, non-blocking
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(app); })
    .catch(() => {});
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export {
  app,
  auth,
  db,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
