import React from 'react';

export const AreaChart = ({ data = [], height = 200 }) => {
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 500},${200 - d}`).join(' ');
  const areaPoints = `0,200 ${points} 500,200`;

  return (
    <div style={{ height }} className="w-full relative flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#areaGrad)" />
        <polyline
          points={points}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
