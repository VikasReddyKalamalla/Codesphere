import React from 'react';

export const EventTimeline = ({ agenda = [] }) => {
  return (
    <div className="flex flex-col gap-4 select-none relative pl-4 border-l border-slate-200 dark:border-slate-800">
      {agenda.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-0.5 relative">
          <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#04AA6D] border-2 border-white dark:border-slate-950" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">{item.time}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.task}</span>
        </div>
      ))}
    </div>
  );
};
