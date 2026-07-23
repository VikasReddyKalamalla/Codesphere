import React from 'react';
import { ProgressBar } from '@components/common/ProgressBar.jsx';

export const ProgressTracker = ({ current = 0, total = 100 }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2.5 w-full select-none shadow-sm">
      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>Syllabus Covered</span>
        <span>{current}/{total} Modules</span>
      </div>
      <ProgressBar value={current} max={total} color="bg-indigo-650" />
    </div>
  );
};
