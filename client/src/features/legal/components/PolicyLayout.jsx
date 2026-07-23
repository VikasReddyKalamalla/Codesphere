import React from 'react';

export const PolicyLayout = ({ title, children }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm animate-fade-in flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-850 pb-3">{title}</h2>
      <div className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed space-y-4 font-medium">
        {children}
      </div>
    </div>
  );
};
