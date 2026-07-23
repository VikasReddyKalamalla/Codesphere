import React from 'react';

export const PieChart = ({ data = [], height = 200 }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  let accumulatedAngle = 0;

  return (
    <div style={{ height }} className="w-full flex items-center justify-center gap-6 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50 select-none">
      <svg width="150" height="150" viewBox="0 0 32 32" className="transform -rotate-90 shrink-0">
        {data.map((item, idx) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = 100 - accumulatedAngle;
          accumulatedAngle += percentage;

          return (
            <circle
              key={idx}
              cx="16"
              cy="16"
              r="15.915"
              fill="transparent"
              stroke={item.color || '#4f46e5'}
              strokeWidth="3.2"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="hover:stroke-[4px] transition-all cursor-pointer"
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-2 text-xs">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-slate-600 dark:text-slate-350">{item.label} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
