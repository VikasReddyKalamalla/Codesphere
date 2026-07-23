import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Users, Video, Award } from 'lucide-react';
import { Logo } from '../components/Logo.jsx';
import { ScrollingCodeBackground } from '../features/landing/components/ScrollingCodeBackground.jsx';

const highlights = [
  { icon: Terminal, text: 'Real-time compiler sandboxes' },
  { icon: Users,    text: 'Collaborative team workspaces' },
  { icon: Video,    text: 'Live video lecture sessions'   },
  { icon: Award,    text: 'Certificates & leaderboards'   },
];

const AuthLayout = () => (
  <div className="min-h-screen flex relative overflow-hidden" style={{ background: '#ffffff' }}>

    {/* Animated scrolling code background */}
    <ScrollingCodeBackground />

    {/* Left branding panel */}
    <div className="hidden lg:flex lg:w-[44%] shrink-0 flex-col relative bg-transparent">
      <div className="relative flex flex-col h-full px-12 py-10 z-10">
        <Logo size="w-7 h-7" textColor="text-slate-800" />

        <div className="flex-1 flex flex-col justify-center gap-8 max-w-sm select-none">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 leading-snug tracking-tight">
              Code together.<br />Learn faster.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
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
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white border border-slate-200 shadow-sm">
                  <Icon className="w-4 h-4 text-slate-700" />
                </div>
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{text}</span>
              </motion.li>
            ))}
          </ul>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-xl border border-slate-200 bg-white/95 shadow-md overflow-hidden text-left"
          >
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-200 bg-slate-50">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2 text-[10px] font-mono text-slate-500">sandbox.py</span>
            </div>
            <div className="px-5 py-4 font-mono text-[11px] leading-6 bg-slate-50/50">
              <p><span className="text-blue-600 font-bold">def</span> <span className="text-slate-800 font-bold">greet</span><span className="text-slate-500">(name):</span></p>
              <p className="pl-4"><span className="text-blue-600 font-bold">return</span> <span className="text-amber-800">f"Hello, {'{name}'}!"</span></p>
              <p className="mt-1.5 text-slate-400">{'# → output'}</p>
              <p className="text-green-600 font-bold">{'> Hello, CodeSphere!  ✓  31ms'}</p>
            </div>
          </motion.div>
        </div>

        <p className="text-[10px] font-mono mt-4 text-slate-400">
          © {new Date().getFullYear()} CodeSphere
        </p>
      </div>
    </div>

    {/* Right form panel */}
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white/60 backdrop-blur-sm relative z-10">
      {/* Mobile logo */}
      <div className="mb-10 lg:hidden">
        <Logo size="w-7 h-7" textColor="text-slate-800" />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
