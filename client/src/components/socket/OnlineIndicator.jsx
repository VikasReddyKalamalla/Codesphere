import React from 'react';
import clsx from 'clsx';

export const OnlineIndicator = ({ isOnline = false }) => {
  return (
    <div className="flex items-center gap-1.5 select-none shrink-0">
      <span className={clsx(
        'w-2 h-2 rounded-full',
        isOnline ? 'bg-emerald-500 shadow-sm animate-pulse ring-2 ring-emerald-500/20' : 'bg-slate-450'
      )} />
      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">
        {isOnline ? 'Online' : 'Disconnected'}
      </span>
    </div>
  );
};
