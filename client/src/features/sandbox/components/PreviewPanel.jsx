import React from 'react';

export const PreviewPanel = () => {
  return (
    <div className="border border-slate-202 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl p-4 flex flex-col justify-center items-center select-none text-center min-h-[150px]">
      <span className="text-xs font-bold text-slate-800 dark:text-white">Render Viewport</span>
      <span className="text-[10px] text-slate-400 mt-1">Vite server preview frame ready</span>
    </div>
  );
};
