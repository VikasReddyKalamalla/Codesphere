import React from 'react';
import { Info, Code2, ShieldCheck, Heart } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> About CodeSphere Platform
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Software architecture details, open source licenses, build numbers, and terms</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">CodeSphere Enterprise SaaS</h3>
            <p className="text-xs text-slate-500 font-mono">Version 2.4.0 (Build 2026.07.19)</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-300 text-xs font-bold font-mono">
            RELEASED & STABLE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500">Frontend Stack</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">React 18 + Redux + Tailwind</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500">Backend Core</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">Node.js + Express + Socket.IO</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500">Database Engine</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-1">MongoDB Atlas Sharded</div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center justify-between">
          <span>© 2026 CodeSphere Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#terms" className="hover:text-[#04AA6D]">Terms of Service</a>
            <a href="#privacy" className="hover:text-[#04AA6D]">Privacy Policy</a>
            <a href="#licenses" className="hover:text-[#04AA6D]">Open Source Licenses</a>
          </div>
        </div>
      </div>
    </div>
  );
};
