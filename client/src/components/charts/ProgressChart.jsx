import React from 'react';
import { ProgressBar } from '../common/ProgressBar.jsx';

export const ProgressChart = ({ data = [] }) => {
  return (
    <div className="flex flex-col gap-4 border border-slate-100 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-900/50">
      {data.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold text-slate-755 dark:text-slate-350">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>
          <ProgressBar value={item.value} color={item.color || 'bg-indigo-600'} />
        </div>
      ))}
    </div>
  );
};
