import React from 'react';
import { ProgressBar } from '@components/common/ProgressBar.jsx';

export const ProgressTracker = ({ compiled = 0, target = 100 }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2 shadow-sm w-full select-none">
      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-350">
        <span>LOC Compilations targets</span>
        <span>{compiled}/{target} lines</span>
      </div>
      <ProgressBar value={compiled} max={target} color="bg-indigo-650" />
    </div>
  );
};
