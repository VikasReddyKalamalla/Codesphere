import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@config/firebase.js';
import { googleAuthThunk } from '../redux/authThunk.js';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const navigateAfterLogin = (user, from, navigate) => {
  const dest =
    user?.role === 'admin'      ? '/admin/dashboard' :
    user?.role === 'instructor' ? '/instructor/dashboard' :
    from || '/dashboard';
  // Small delay to allow Redux state to propagate before navigation
  setTimeout(() => navigate(dest, { replace: true }), 50);
};

export const SocialLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  // Handle redirect result (when popup was blocked and redirect was used)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const outcome = await dispatch(googleAuthThunk(result.user));
          if (outcome?.token && outcome?.user) {
            toast.success(`Signed in as ${result.user.displayName || result.user.email}!`);
            navigateAfterLogin(outcome.user, from, navigate);
          }
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured() || !auth) {
      toast.error('Firebase not configured. Check your .env.development file.');
      return;
    }

    setLoading(true);
    try {
      let firebaseUser = null;

      try {
        const result = await signInWithPopup(auth, googleProvider);
        firebaseUser = result.user;
      } catch (popupErr) {
        if (popupErr.code === 'auth/popup-blocked') {
          toast('Popup blocked — redirecting to Google sign-in...');
          await signInWithRedirect(auth, googleProvider);
          return; // page will reload after redirect
        }
        throw popupErr;
      }

      if (!firebaseUser) return;

      // Dispatch to backend → save token & user in Redux + localStorage
      const outcome = await dispatch(googleAuthThunk(firebaseUser));

      if (outcome?.token && outcome?.user) {
        toast.success(`Welcome, ${firebaseUser.displayName || firebaseUser.email}! 🎉`);
        navigateAfterLogin(outcome.user, from, navigate);
      } else {
        throw new Error('Authentication succeeded but no session was created.');
      }
    } catch (err) {
      console.error('[Google Auth Error]:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User closed popup — silently ignore
      } else if (code === 'auth/unauthorized-domain') {
        toast.error('Localhost is not in your Firebase Authorized Domains. Add it in the Firebase console.');
      } else {
        toast.error(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 w-full select-none">
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200" />
        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">or continue with</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      <motion.button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
        whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:text-[#4285F4] hover:border-[#4285F4]/40 hover:shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 text-[#4285F4] animate-spin" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleIcon />
            <span>Continue with Google</span>
          </>
        )}
      </motion.button>
    </div>
  );
};
