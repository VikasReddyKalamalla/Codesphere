import React from 'react';

export const HealthMonitor = () => {
  return (
    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs select-none">
      <span className="font-semibold text-emerald-600">Docker Compilers cluster</span>
      <span className="font-bold text-emerald-600 uppercase text-[10px]">Healthy</span>
    </div>
  );
};
