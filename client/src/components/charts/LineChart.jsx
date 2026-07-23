import React from 'react';

export const LineChart = ({ data = [], height = 200 }) => {
  return (
    <div style={{ height }} className="w-full relative flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
        <path
          d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 500} ${200 - d}`).join(' L ')}`}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 500}
            cy={200 - d}
            r="4.5"
            fill="#ffffff"
            stroke="#4f46e5"
            strokeWidth="3"
            className="hover:scale-130 transition-transform cursor-pointer"
          />
        ))}
      </svg>
    </div>
  );
};
