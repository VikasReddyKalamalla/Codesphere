import React from 'react';

export const Globe = () => {
  return (
    <div className="border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-6 flex flex-col items-center justify-center relative select-none overflow-hidden min-h-[220px]">
      <svg width="150" height="150" viewBox="0 0 100 100" className="animate-[spin_40s_linear_infinite] text-indigo-500/20">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="absolute flex flex-col items-center text-center">
        <span className="text-xs font-bold text-slate-800 dark:text-white">Active Learners Map</span>
        <span className="text-[10px] text-slate-400 mt-1">120+ Active coding terminals worldwide</span>
      </div>
    </div>
  );
};
