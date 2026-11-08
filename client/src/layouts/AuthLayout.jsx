import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Users, Video, Award, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';

const highlights = [
  { icon: Terminal, text: 'Real-time compiler sandboxes' },
  { icon: Users,    text: 'Collaborative team workspaces' },
  { icon: Video,    text: 'Live video lecture sessions'   },
  { icon: Award,    text: 'Certificates & leaderboards'   },
];

const AuthLayout = () => (
  <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

    {/* Left branding panel */}
    <div className="hidden lg:flex lg:w-[44%] shrink-0 flex-col relative bg-white/50 dark:bg-slate-900/40 border-r border-slate-200/80 dark:border-slate-800/80">
      <div className="relative flex flex-col h-full px-12 py-10 z-10">
        <Logo size="w-7 h-7" textColor="text-slate-800 dark:text-white" />

        <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm select-none">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-[#04AA6D]/10 text-[#04AA6D] border border-[#04AA6D]/20 mb-3">
              <Sparkles size={11} />
              <span>CLOUD WORKSPACE & LEARNING</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white leading-snug tracking-tight font-mono-origin">
              Code together.<br />Learn faster.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-sans-origin">
              All-in-one platform for compiler sandboxes, collaborative workspaces, live sessions, and assessments.
            </p>
          </div>

          <ul className="flex flex-col gap-3.5">
            {highlights.map(({ icon: Icon, text }, idx) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-mono-origin">{text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800/40 border border-emerald-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Trusted by 12,000+ engineers, students, and educators.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Zero-setup browser development environments with 83 interactive roadmaps.
            </p>
          </div>
        </div>

        <p className="text-[10px] font-mono mt-4 text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} CodeSphere
        </p>
      </div>
    </div>

    {/* Right form panel */}
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950 relative z-10">
      {/* Mobile logo */}
      <div className="mb-10 lg:hidden">
        <Logo size="w-7 h-7" textColor="text-slate-800 dark:text-white" />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
