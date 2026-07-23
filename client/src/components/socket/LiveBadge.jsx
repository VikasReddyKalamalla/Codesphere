import React from 'react';

export const LiveBadge = ({ label = 'Live Now' }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-50 text-rose-700 border border-rose-250 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 shadow-sm ring-4 ring-rose-500/5">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
      <span>{label}</span>
    </span>
  );
};
