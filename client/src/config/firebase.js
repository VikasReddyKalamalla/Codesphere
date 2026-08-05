import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  browserSessionPersistence, 
  inMemoryPersistence, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'velfound-d7c7d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '967891413630',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-GCYTEBV4YJ',
};

// Helper to check if Firebase is configured
export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    firebaseConfig.authDomain
  );
};

// Create Auth instance with robust persistence fallbacks to prevent IndexedDB locks
const createAuthWithPersistenceFallback = (appInstance) => {
  try {
    return initializeAuth(appInstance, {
      persistence: [browserLocalPersistence, browserSessionPersistence, inMemoryPersistence]
    });
  } catch (err) {
    return getAuth(appInstance);
  }
};

// Initialize Firebase safely
let app;
let auth;
let db;
let analytics = null;

if (isFirebaseConfigured()) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = createAuthWithPersistenceFallback(app);
  db = getFirestore(app);
  
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
} else {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = createAuthWithPersistenceFallback(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn('[Firebase] Config keys missing or invalid:', err.message);
    app = null;
    auth = null;
    db = null;
  }
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
