import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { X, Loader2, ArrowRight } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const googleAccounts = [
  { name: 'Alex Developer', email: 'alex.dev.google@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
  { name: 'Sarah Student', email: 'sarah.student.google@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
  { name: 'Professor Jacob', email: 'jacob.prof.google@gmail.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80' },
];

const githubAccounts = [
  { name: 'git_guru', email: 'guru.git.github@gmail.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' },
  { name: 'coder_octo', email: 'octo.coder.github@gmail.com', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80' },
];

export const SocialLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeProvider, setActiveProvider] = useState(null); // 'google' | 'github' | null
  const [loadingAccount, setLoadingAccount] = useState(null); // email of account being logged in
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');

  const handleOAuthFlow = async (email, name) => {
    setLoadingAccount(email);
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_') + '_' + (activeProvider || 'oauth');
    const defaultPassword = 'OAuthMockPassword123!';

    try {
      // 1. Attempt to register first
      await register({
        fullName: name,
        username,
        email,
        password: defaultPassword,
      });
      toast.success(`Registered & Logged in as ${name}!`);
      closeModal();
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (regErr) {
      // 2. If registration fails (e.g. email exists), attempt login
      try {
        await login({
          email,
          password: defaultPassword,
        });
        toast.success(`Logged in as ${name}!`);
        closeModal();
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch (loginErr) {
        toast.error('This email is already registered with a manual password. Please sign in via the credentials form.');
      }
    } finally {
      setLoadingAccount(null);
    }
  };

  const closeModal = () => {
    setActiveProvider(null);
    setShowCustomForm(false);
    setCustomEmail('');
    setCustomName('');
  };

  return (
    <div className="flex flex-col gap-3.5 w-full select-none font-mono-origin">
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200" />
        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">or continue with</span>
        <div className="flex-1 border-t border-slate-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Google Trigger */}
        <motion.button
          type="button"
          onClick={() => setActiveProvider('google')}
          whileHover={{ scale: 1.02, y: -1, borderColor: 'rgba(66, 133, 244, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:text-[#4285F4] cursor-pointer"
        >
          <GoogleIcon />
          Google
        </motion.button>

        {/* GitHub Trigger */}
        <motion.button
          type="button"
          onClick={() => setActiveProvider('github')}
          whileHover={{ scale: 1.02, y: -1, borderColor: 'rgba(36, 41, 47, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border border-slate-200 bg-white text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <GitHubIcon />
          GitHub
        </motion.button>
      </div>

      {/* Mock OAuth Popup Modal Overlay */}
      <AnimatePresence>
        {activeProvider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-10 p-6 flex flex-col items-center"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Provider Header Logo & Slogan */}
              <div className="flex flex-col items-center mb-6">
                {activeProvider === 'google' ? (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-full shadow-sm mb-3">
                      <GoogleIcon />
                    </div>
                    <h3 className="font-sans-origin text-lg font-bold text-slate-800">Sign in with Google</h3>
                    <p className="font-sans-origin text-[11px] text-slate-400 mt-1">to continue to <span className="font-semibold text-slate-600">CodeSphere</span></p>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-full shadow-sm mb-3">
                      <GitHubIcon />
                    </div>
                    <h3 className="font-sans-origin text-lg font-bold text-slate-800">Authorize CodeSphere</h3>
                    <p className="font-sans-origin text-[11px] text-slate-400 mt-1">by <span className="font-semibold text-slate-600">codesphere-org</span></p>
                  </>
                )}
              </div>

              {/* Account List / Dynamic Form */}
              {!showCustomForm ? (
                <div className="w-full flex flex-col gap-2.5">
                  {(activeProvider === 'google' ? googleAccounts : githubAccounts).map((acc) => (
                    <button
                      key={acc.email}
                      disabled={loadingAccount !== null}
                      onClick={() => handleOAuthFlow(acc.email, acc.name)}
                      className="w-full flex items-center gap-3 p-3 border border-slate-100 bg-slate-50 hover:bg-slate-100/70 hover:border-slate-200 rounded-xl transition-all text-left cursor-pointer group disabled:opacity-50"
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans-origin text-xs font-bold text-slate-800 truncate group-hover:text-[#04AA6D] transition-colors">{acc.name}</p>
                        <p className="font-mono-origin text-[10px] text-slate-400 truncate">{acc.email}</p>
                      </div>
                      {loadingAccount === acc.email ? (
                        <Loader2 className="w-4 h-4 text-[#04AA6D] animate-spin shrink-0" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-350 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="w-full text-center py-2.5 font-sans-origin text-[11px] font-bold text-slate-500 hover:text-[#04AA6D] border border-dashed border-slate-200 hover:border-[#04AA6D]/40 rounded-xl bg-white transition-colors cursor-pointer"
                  >
                    + Use custom account details
                  </button>
                </div>
              ) : (
                /* Custom Form for developer testing */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customEmail || !customName) {
                      toast.error('Name and email are required');
                      return;
                    }
                    handleOAuthFlow(customEmail, customName);
                  }}
                  className="w-full flex flex-col gap-3 font-sans-origin"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Code Maestro"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#04AA6D] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. dev@codesphere.org"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#04AA6D] transition-colors"
                      required
                    />
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomForm(false)}
                      className="flex-1 py-2 text-center text-xs font-bold border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loadingAccount !== null}
                      className="flex-1 py-2 text-center text-xs font-bold bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      {loadingAccount ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Mock Consent Warning Text */}
              <p className="font-sans-origin text-[9px] leading-relaxed text-slate-400 text-center mt-6 select-none border-t border-slate-100 pt-4">
                This is a secure mock authentication simulator for local environment testing. CodeSphere will store your profile details securely in the local database.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
