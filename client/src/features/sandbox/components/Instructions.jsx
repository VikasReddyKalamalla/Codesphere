import React from 'react';

export const Instructions = ({ text = 'Implement React custom button widgets.' }) => {
  return (
    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 select-none leading-relaxed text-xs text-slate-700 dark:text-slate-350 shadow-sm font-medium">
      <span className="font-bold text-indigo-650 dark:text-indigo-400 block mb-1">Task Instructions</span>
      <p>{text}</p>
    </div>
  );
};
