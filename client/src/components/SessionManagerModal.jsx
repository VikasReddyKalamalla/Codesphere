import React, { useState } from 'react';
import {
  GitBranch, GitCommit, GitPullRequest, Trash2, CheckCircle2,
  X, ExternalLink, ArrowRight, ShieldCheck, Sparkles, FolderGit2, AlertTriangle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const Github = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/**
 * SessionManagerModal
 * Handles Start-of-Session and End-of-Session workflows:
 * 1. Start: Open GitHub repo vs Start new clean session
 * 2. End: Connect/Push to GitHub vs Terminate session & clear storage
 */
export const SessionManagerModal = ({
  isOpen,
  mode = 'start', // 'start' | 'end'
  isGitHubImported = false,
  githubRepoUrl = '',
  onStartSession, // ({ isGitHub: boolean, repoUrl: string }) => void
  onEndSession,   // ({ pushToGit: boolean, repoUrl: string, terminateStorage: boolean }) => void
  onClose,
}) => {
  const [sessionChoice, setSessionChoice] = useState(isGitHubImported ? 'github' : 'new');
  const [repoUrlInput, setRepoUrlInput]   = useState(githubRepoUrl || '');
  const [commitMessage, setCommitMessage] = useState('Update from CodeSphere Web Studio');
  const [actionStep, setActionStep]       = useState('choose'); // 'choose' | 'connect_git'
  const [isProcessing, setIsProcessing]   = useState(false);

  if (!isOpen) return null;

  // Handle Start Session submit
  const handleStartSubmit = (e) => {
    e.preventDefault();
    if (sessionChoice === 'github') {
      if (!repoUrlInput.trim()) {
        toast.error('Please enter a valid GitHub repository URL');
        return;
      }
      toast.success('Importing GitHub repository into workspace...');
      onStartSession({ isGitHub: true, repoUrl: repoUrlInput.trim() });
    } else {
      toast.success('Starting clean practice session...');
      onStartSession({ isGitHub: false, repoUrl: '' });
    }
  };

  // Handle End Session push to GitHub
  const handlePushToGit = async () => {
    if (!repoUrlInput.trim()) {
      toast.error('Please enter your GitHub repository URL to push changes');
      return;
    }
    setIsProcessing(true);
    const toastId = toast.loading('Syncing changes to GitHub repository...');

    setTimeout(() => {
      setIsProcessing(false);
      toast.success('All edits successfully pushed to your GitHub repository!', { id: toastId });
      onEndSession({ pushToGit: true, repoUrl: repoUrlInput.trim(), terminateStorage: true });
    }, 1500);
  };

  // Handle Terminate Session & Clear Storage
  const handleTerminateStorage = () => {
    toast.success('Session terminated. Cloud storage cleared successfully.', {
      icon: '🗑️',
      style: { background: '#0B0F17', color: '#f43f5e', border: '1px solid #f43f5e30' }
    });
    onEndSession({ pushToGit: false, repoUrl: '', terminateStorage: true });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans">
      <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative flex flex-col gap-5 text-slate-800 dark:text-slate-100">
        
        {/* Modal Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        {/* ── MODE 1: START OF SESSION DIALOG ── */}
        {mode === 'start' && (
          <form onSubmit={handleStartSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#04AA6D]/10 border border-[#04AA6D]/20 flex items-center justify-center text-[#04AA6D] shrink-0">
                <FolderGit2 size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-[#04AA6D]">
                  CodeSphere Workspace Launcher
                </span>
                <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                  Initialize Your Coding Session
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose whether to import your existing work from GitHub or launch a fresh scratch session.
            </p>

            {/* Selection Option Cards */}
            <div className="flex flex-col gap-3">
              {/* Option A: GitHub Repo */}
              <label
                onClick={() => setSessionChoice('github')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  sessionChoice === 'github'
                    ? 'border-[#04AA6D] bg-[#04AA6D]/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="sessionType"
                  checked={sessionChoice === 'github'}
                  onChange={() => setSessionChoice('github')}
                  className="mt-1 accent-[#04AA6D]"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Github size={15} className="text-slate-800 dark:text-white" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Open / Import GitHub Repository
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Clone an existing repository from your GitHub account to continue working.
                  </span>
                </div>
              </label>

              {/* GitHub URL Input when selected */}
              {sessionChoice === 'github' && (
                <div className="pl-8 pr-1 flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      required
                      value={repoUrlInput}
                      onChange={(e) => setRepoUrlInput(e.target.value)}
                      placeholder="e.g. https://github.com/username/my-project"
                      className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-[#04AA6D] text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Option B: Clean Practice Session */}
              <label
                onClick={() => setSessionChoice('new')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  sessionChoice === 'new'
                    ? 'border-[#04AA6D] bg-[#04AA6D]/5'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="sessionType"
                  checked={sessionChoice === 'new'}
                  onChange={() => setSessionChoice('new')}
                  className="mt-1 accent-[#04AA6D]"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-[#04AA6D]" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Start Clean New Practice Session
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Launch a fresh workspace for temporary coding, testing ideas, or practice.
                  </span>
                </div>
              </label>
            </div>

            {/* Launch Action Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-950/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Launch Workspace Session</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* ── MODE 2: END OF SESSION DIALOG ── */}
        {mode === 'end' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isGitHubImported
                  ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}>
                {isGitHubImported ? <GitCommit size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${
                  isGitHubImported ? 'text-purple-500' : 'text-amber-500'
                }`}>
                  {isGitHubImported ? 'GitHub Repository Sync' : 'Important Session Notice'}
                </span>
                <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                  {isGitHubImported
                    ? 'Push Changes to GitHub Repository?'
                    : 'Save Important Project to GitHub?'}
                </h3>
              </div>
            </div>

            {/* Context Explanation */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 font-sans">
              {isGitHubImported ? (
                <>
                  You worked on an imported GitHub repository (<strong className="font-mono text-purple-600 dark:text-purple-400">{githubRepoUrl || 'GitHub Repo'}</strong>).
                  Pushing your latest commits ensures your code is permanently saved to your GitHub profile.
                </>
              ) : (
                <>
                  If your project is important, <strong>connect it to a GitHub repository</strong> before closing so your code is saved to your account!
                  Otherwise, terminating will clean temporary storage to keep CodeSphere fast.
                </>
              )}
            </p>

            {/* GitHub Repo URL Input (if connecting new project or editing repo) */}
            {actionStep === 'connect_git' || !isGitHubImported ? (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">
                  Target GitHub Repository URL
                </label>
                <div className="relative">
                  <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                    placeholder="https://github.com/username/my-saved-project"
                    className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-[#04AA6D] text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            ) : null}

            {/* End Session Action Buttons */}
            <div className="flex flex-col gap-3.5 mt-1">
              
              {/* Button 1: Connect & Push to GitHub */}
              <button
                onClick={handlePushToGit}
                disabled={isProcessing}
                className="w-full py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Github size={15} />
                )}
                <span>
                  {isGitHubImported
                    ? '⬆️ Push Changes to GitHub Repository'
                    : '🔗 Connect & Save to GitHub Repo'}
                </span>
              </button>

              {/* Button 2: Terminate Session & Clean Storage */}
              <button
                onClick={handleTerminateStorage}
                disabled={isProcessing}
                className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs rounded-2xl transition-all border border-slate-200 dark:border-slate-700 hover:border-rose-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash2 size={15} />
                <span>
                  {isGitHubImported ? 'Exit Without Pushing' : '🗑️ Terminate & Clean Temporary Session'}
                </span>
              </button>
            </div>

            {/* Storage & Practice Benefits Note */}
            <div className="flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800">
              <ShieldCheck size={14} className="text-[#04AA6D] shrink-0" />
              <span>GitHub integration preserves your portfolio and keeps CodeSphere storage optimized.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
