import React from 'react';

export const RadarChart = ({ data = [], height = 200 }) => {
  return (
    <div style={{ height }} className="w-full flex items-center justify-center border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/50">
      <svg width="160" height="160" viewBox="0 0 200 200" className="overflow-visible select-none">
        <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="100,50 150,75 150,125 100,150 50,125 50,75" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="100,75 125,87 125,112 100,125 75,112 75,87" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        <polygon points="100,40 140,80 160,130 100,140 60,110 50,70" fill="rgba(79, 70, 229, 0.25)" stroke="#4f46e5" strokeWidth="2.5" />
      </svg>
    </div>
  );
};
