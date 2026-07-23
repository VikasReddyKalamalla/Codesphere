import React from 'react';
import { Users } from 'lucide-react';

export const CommunityHeader = ({ title = 'College Space', subtitle = 'Learn together' }) => {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl p-5 select-none shadow-sm dark:shadow-xl relative overflow-hidden text-left">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-xl relative z-10 shrink-0">
        <Users className="w-5 h-5 animate-pulse" />
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">{title}</h3>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};
export default CommunityHeader;
