import React from 'react';
import clsx from 'clsx';

export const ProgressBar = ({
  value = 0,
  max = 100,
  className = '',
  showLabel = false,
  color = 'bg-indigo-600'
}) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-300 ease-out-quad', color)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
