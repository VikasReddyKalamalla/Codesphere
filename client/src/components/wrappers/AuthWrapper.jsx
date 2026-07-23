import React from 'react';

export const AuthWrapper = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6 animate-scale-in">
        {children}
      </div>
    </div>
  );
};
