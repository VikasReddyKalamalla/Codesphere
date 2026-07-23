import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, ChevronDown, Play, Users } from 'lucide-react';

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
  const [terminalText, setTerminalText] = useState('');
  const [stage, setStage] = useState(0); // 0: typing, 1: running, 2: output, 3: restart delay
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const handleRestrictedClick = (e, path) => {
    const isLoggedIn = !!localStorage.getItem(import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token');
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % codingQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    let timer;
    const command = 'codesphere run --playpen react_ws_test.js';
    
    if (stage === 0) {
      if (terminalText.length < command.length) {
        timer = setTimeout(() => {
          setTerminalText(command.substring(0, terminalText.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => {
          setStage(1);
        }, 600);
      }
    } else if (stage === 1) {
      timer = setTimeout(() => {
        setStage(2);
      }, 1200);
    } else if (stage === 2) {
      timer = setTimeout(() => {
        setStage(3);
      }, 4500);
    } else if (stage === 3) {
      timer = setTimeout(() => {
        setTerminalText('');
        setStage(0);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [terminalText, stage]);

  return (
    <section className="relative px-6 pt-24 pb-20 w-full flex flex-col items-center text-center overflow-hidden bg-transparent z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-4xl w-full flex flex-col items-center z-10"
      >

        {/* Dynamic Coding Quotations Headline */}
        <div className="h-40 sm:h-32 flex flex-col items-center justify-center select-none w-full max-w-4xl px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <h1 className="font-sans-origin text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight italic">
                "{codingQuotes[quoteIndex].text}"
              </h1>
              <p className="font-mono-origin text-xs sm:text-sm text-[#04AA6D] font-bold uppercase tracking-wider">
                — {codingQuotes[quoteIndex].author}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Description */}
        <p className="font-sans-origin mt-6 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Codesphere brings classrooms and engineering teams real-time compiler playpens, 
          multiplayer codex workspaces, live study sessions, and automated assessments in a single dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/sandbox"
              onClick={(e) => handleRestrictedClick(e, '/sandbox')}
              className="font-mono-origin inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg hover:shadow-green-500/10 transition-all duration-200"
            >
              Launch Sandbox <Play className="w-3 h-3 fill-current" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/codex"
              onClick={(e) => handleRestrictedClick(e, '/codex')}
              className="font-mono-origin inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-350 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all duration-200"
            >
              Collaborative Codex <Users className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 flex flex-wrap justify-center gap-12 select-none">
          {stats.map((s) => (
            <motion.div 
              whileHover={{ y: -3 }}
              key={s.label} 
              className="flex flex-col items-center cursor-default"
            >
              <span className="font-mono-origin text-xl sm:text-2xl font-bold text-slate-900">{s.value}</span>
              <span className="font-mono-origin text-[9px] text-slate-500 uppercase tracking-widest mt-1.5">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive Code / Compiler preview (Light Themed IDE Mockup) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -6, 
          scale: 1.01, 
          boxShadow: '0 20px 40px -15px rgba(4, 170, 109, 0.15)' 
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mt-16 rounded-xl border border-slate-200 bg-white overflow-hidden w-full max-w-2xl shadow-xl z-10 cursor-pointer"
      >
        {/* IDE Header */}
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-slate-200 bg-slate-50 select-none">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
          </div>
          <span className="ml-3 font-mono-origin text-[10px] text-slate-500">compiler-sandbox.js — codesphere</span>
          <span className="ml-auto font-mono-origin text-[9px] text-slate-500 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${stage === 1 ? 'bg-amber-500 animate-ping' : stage === 2 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            {stage === 0 ? 'Ready' : stage === 1 ? 'Compiling' : stage === 2 ? 'Successful' : 'Idling'}
          </span>
        </div>
        
        {/* IDE Editor Lines */}
        <div className="px-5 py-6 font-mono-origin text-left text-xs sm:text-sm leading-8 select-none bg-slate-50/50">
          <div className="flex items-center text-slate-700">
            <span className="text-blue-500 mr-2.5">$</span>
            <span>{terminalText}</span>
            {stage === 0 && <span className="w-2 h-4 bg-blue-500 ml-0.5 animate-pulse" />}
          </div>
          
          {stage >= 1 && (
            <p className="mt-1 text-slate-500 animate-pulse">
              Connecting to playpen sandbox websocket compiler...
            </p>
          )}

          {stage >= 2 && (
            <div className="mt-2 text-emerald-800 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                <Code2 size={13} />
                COMPILATION COMPLETE
              </span>
              <span className="text-slate-600 text-[11px]">
                ✓ Output: 6a4881916697eee9d2e37717 save_test.js saved to DB
              </span>
              <span className="text-slate-500 text-[10px]">
                Memory: 4.8MB │ Executed in: 34ms │ Status: 0 errors
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Scroll Down bouncing indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="mt-16 select-none cursor-default text-slate-400 flex flex-col items-center gap-1"
      >
        <span className="font-mono-origin text-[9px] tracking-widest uppercase">SCROLL TO CODE</span>
        <ChevronDown size={14} className="animate-pulse" />
      </motion.div>
    </section>
  );
};
export default Hero;
