import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  inMemoryPersistence,
  browserSessionPersistence,
  browserPopupRedirectResolver,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

// Initialize Firebase App (singleton-safe across Vite HMR reloads)
const appInstance = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// initializeAuth with:
//   - browserSessionPersistence/inMemoryPersistence → bypass IndexedDB (no "Database closing" error)
//   - browserPopupRedirectResolver → required for signInWithPopup to work
let auth;
try {
  auth = initializeAuth(appInstance, {
    persistence: [browserSessionPersistence, inMemoryPersistence],
    popupRedirectResolver: browserPopupRedirectResolver,
  });
} catch (_e) {
  // Already initialized (Vite HMR double-init) — reuse existing instance
  auth = getAuth(appInstance);
}

const db = getFirestore(appInstance);

let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((ok) => { if (ok) analytics = getAnalytics(appInstance); })
    .catch(() => {});
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const app = appInstance;

export {
  auth,
  db,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
};
