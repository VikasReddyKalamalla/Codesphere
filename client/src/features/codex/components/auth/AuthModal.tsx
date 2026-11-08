import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGitHub, user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMsg('Account created successfully! Welcome to CodeSphere.');
          setTimeout(() => onClose(), 1200);
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setError(null);
    setLoading(true);
    const res = await signInWithGitHub();
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-[#181824] border border-[#2b2b3b] rounded-xl shadow-2xl overflow-hidden text-[#cccccc] font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2b2b3b] bg-[#12121a]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#04AA6D] to-[#00f2fe] flex items-center justify-center font-mono font-bold text-black text-sm">
              C
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">
                {user ? 'Account Settings' : isSignUp ? 'Create Codex Account' : 'Sign In to CodeSphere'}
              </h2>
              <p className="text-[11px] text-[#858595]">Multiplayer Cloud Development IDE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#858595] hover:text-white hover:bg-[#2b2b3b] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-[#1e1e2d] border border-[#2b2b3b] rounded-lg">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#04AA6D]/20 text-[#04AA6D] flex items-center justify-center font-bold text-sm">
                    {user.fullName[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-white">{user.fullName}</div>
                  <div className="text-xs text-[#858595]">{user.email}</div>
                  <div className="text-[10px] text-[#04AA6D] font-mono mt-0.5">● Connected (Persistent Account)</div>
                </div>
              </div>

              <button
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                className="w-full py-2 bg-[#ff5555]/10 hover:bg-[#ff5555]/20 text-[#ff5555] border border-[#ff5555]/30 rounded-lg text-xs font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 p-2.5 bg-[#ff5555]/10 border border-[#ff5555]/30 rounded text-xs text-[#ff8080]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 flex items-center gap-2 p-2.5 bg-[#04AA6D]/10 border border-[#04AA6D]/30 rounded text-xs text-[#04AA6D]">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={handleGitHub}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg text-xs font-medium transition-colors border border-[#444d56] mb-4"
              >
                <GithubIcon className="w-4 h-4" />
                Continue with GitHub
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#2b2b3b]" />
                <span className="text-[11px] text-[#6b6b7b] uppercase tracking-wider font-medium">or email</span>
                <div className="flex-1 h-px bg-[#2b2b3b]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {isSignUp && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#a0a0b0] mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-[#606070]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ada Lovelace"
                        className="w-full bg-[#12121a] border border-[#2b2b3b] focus:border-[#04AA6D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#505060] outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-[#a0a0b0] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#606070]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@example.com"
                      className="w-full bg-[#12121a] border border-[#2b2b3b] focus:border-[#04AA6D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#505060] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#a0a0b0] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#606070]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#12121a] border border-[#2b2b3b] focus:border-[#04AA6D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-[#505060] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 bg-[#04AA6D] hover:bg-[#03945e] disabled:opacity-50 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors"
                >
                  {loading ? 'Authenticating...' : isSignUp ? 'Create Free Account' : 'Sign In'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[#2b2b3b] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-xs text-[#858595] hover:text-[#04AA6D] transition-colors"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
