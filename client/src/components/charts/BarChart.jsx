import React from 'react';

export const BarChart = ({ data = [], height = 200 }) => {
  return (
    <div style={{ height }} className="w-full flex items-end justify-between gap-4 border border-slate-100 dark:border-slate-800 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-900/50 select-none">
      {data.map((item, idx) => {
        const heightPercent = `${(item.value / 100) * 100}%`;
        return (
          <div key={idx} className="flex flex-col items-center flex-1 gap-2 h-full justify-end group">
            <div className="relative w-full flex justify-center h-full items-end">
              <div
                className="w-full max-w-[32px] rounded-t bg-indigo-650 dark:bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400 group-hover:scale-y-102 origin-bottom"
                style={{ height: heightPercent }}
              />
              <span className="absolute -top-6 text-[10px] font-bold text-slate-800 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate w-full text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
