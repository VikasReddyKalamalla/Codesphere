import React from 'react';
import clsx from 'clsx';

export const ActivityChart = ({ activity = [] }) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex gap-1 min-w-[600px] select-none">
        {Array.from({ length: 40 }).map((_, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const weight = Math.floor(Math.random() * 4);
              const colors = [
                'bg-slate-155 dark:bg-slate-800',
                'bg-indigo-200 dark:bg-indigo-900',
                'bg-indigo-400 dark:bg-indigo-700',
                'bg-indigo-600 dark:bg-indigo-500'
              ];
              return (
                <div
                  key={dayIdx}
                  className={clsx('w-3.5 h-3.5 rounded-sm hover:scale-110 transition-transform cursor-pointer', colors[weight])}
                  title={`Contributions: ${weight * 3}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
