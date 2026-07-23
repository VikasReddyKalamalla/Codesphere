import React from 'react';

export const ProfileStats = ({ stats = {} }) => {
  const list = [
    { label: 'Rank', value: stats.rank || '#4' },
    { label: 'XP Points', value: stats.xp || '2,400' },
    { label: 'Solutions', value: stats.solutions || '12' }
  ];
  return (
    <div className="grid grid-cols-3 gap-3.5 p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850 rounded-xl">
      {list.map((item, idx) => (
        <div key={idx} className="flex flex-col items-center gap-0.5 text-center select-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</span>
          <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
