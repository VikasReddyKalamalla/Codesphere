import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown, Play, Users, Terminal, BookOpen, Layers } from 'lucide-react';

const stats = [
  { label: 'Lines compiled', value: '14.2M+' },
  { label: 'Active classrooms', value: '1,200+' },
  { label: 'Sandbox Uptime', value: '99.99%' },
];

const codingQuotes = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" }
];

export const Hero = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const handleRestrictedClick = (e, path) => {
    let isLoggedIn = false;
    try {
      isLoggedIn = !!(localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token') || localStorage.getItem('token'));
    } catch (_) {}
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % codingQuotes.length);
    }, 6000);
    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <section className="relative px-6 pt-24 pb-20 max-w-6xl mx-auto w-full flex flex-col items-center text-center select-none overflow-hidden">
      
      {/* Dynamic Animated Quotes Header */}
      <div className="h-16 flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-slate-800 dark:text-slate-200 tracking-tight">
              "{codingQuotes[quoteIndex].text}"
            </p>
            <span className="text-xs font-mono font-bold text-[#04AA6D] uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <span>—</span> {codingQuotes[quoteIndex].author}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-sans-origin"
      >
        Codesphere brings classrooms and engineering teams real-time compiler playpens,
        multiplayer codex workspaces, live study sessions, and automated assessments in a single dashboard.
      </motion.p>

      {/* Hero CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-4 relative z-10"
      >
        <Link
          to="/sandbox"
          onClick={(e) => handleRestrictedClick(e, '/sandbox')}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-mono-origin font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Launch Sandbox</span>
          <Play size={13} className="fill-white" />
        </Link>
        <Link
          to="/codex"
          onClick={(e) => handleRestrictedClick(e, '/codex')}
          className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-mono-origin font-semibold text-xs rounded-xl shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>Collaborative Codex</span>
          <Users size={14} className="text-slate-500" />
        </Link>
      </motion.div>

      {/* Platform Key Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-14 w-full max-w-lg"
      >
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center cursor-default">
              <span className="font-mono-origin text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</span>
              <span className="font-mono-origin text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Clean Feature Highlights Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left"
      >
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-[#04AA6D] flex items-center justify-center mb-3">
            <Terminal size={18} />
          </div>
          <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider">Multi-Lang Sandboxes</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Instant execution in Python, C++, Java, Node, Go, Rust, and TypeScript with zero setup.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
            <Layers size={18} />
          </div>
          <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider">Real-Time Codex</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Multi-cursor multiplayer editing powered by Yjs CRDTs and Gemini 2.0 AI assistance.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
            <BookOpen size={18} />
          </div>
          <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase tracking-wider">83 Tech Roadmaps</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Structured full-stack curricula, topic checklists, and interactive quizzes for students.
          </p>
        </div>
      </motion.div>

      {/* Scroll Down bouncing indicator */}
      <div className="mt-14 select-none cursor-default text-slate-400 dark:text-slate-500 flex flex-col items-center gap-1">
        <span className="font-mono-origin text-[9px] tracking-widest uppercase">EXPLORE FEATURES</span>
        <ChevronDown size={14} className="animate-pulse" />
      </div>
    </section>
  );
};
export default Hero;
