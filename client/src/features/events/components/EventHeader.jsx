import React from 'react';

export const EventHeader = ({ title }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl text-center select-none shadow-sm">
      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Hackathons & Seminars</span>
      <h3 className="text-base font-bold text-slate-850 dark:text-white mt-1">{title}</h3>
    </div>
  );
};
