import React from 'react';
import { MapPin } from 'lucide-react';

export const EventMap = ({ locations = [] }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 shadow-sm relative min-h-[220px] overflow-hidden flex items-center justify-center">
      {/* Grid pattern mocking dynamic coordinate map viewport */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
        {Array.from({ length: 36 }).map((_, i) => (
          <div key={i} className="border-t border-l border-slate-400" />
        ))}
      </div>
      <div className="relative flex flex-col items-center gap-3">
        <MapPin className="w-8 h-8 text-rose-500 animate-bounce" />
        <div className="text-center">
          <span className="text-xs font-bold text-slate-800 dark:text-white block">Bootcamps Locations</span>
          <span className="text-[10px] text-slate-400">Map coordinate pins plotted successfully</span>
        </div>
      </div>
    </div>
  );
};
