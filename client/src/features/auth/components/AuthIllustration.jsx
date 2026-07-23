import React from 'react';
import { Compass } from 'lucide-react';

export const AuthIllustration = () => {
  return (
    <div className="hidden lg:flex flex-1 bg-indigo-50/50 dark:bg-slate-950/40 items-center justify-center p-8 border-l border-slate-200 dark:border-slate-850">
      <div className="flex flex-col items-center text-center max-w-sm gap-4 auth-illustration-bg py-10 px-6 rounded-2xl">
        <Compass className="w-16 h-16 text-indigo-650 animate-spin-slow" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Learn. Build. Collaborate.</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Unlock standard playpens sandbox compiling, college group workspaces, coding sessions webcasts, and live assessments.
        </p>
      </div>
    </div>
  );
};
