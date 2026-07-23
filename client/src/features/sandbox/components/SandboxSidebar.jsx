import React from 'react';
import { Code2, Settings } from 'lucide-react';

export const SandboxSidebar = () => {
  return (
    <aside className="w-56 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-full p-4 flex flex-col gap-4 select-none shrink-0 hidden md:block">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
        <Code2 className="w-4 h-4 text-indigo-505" />
        <span className="text-xs font-bold text-slate-850 dark:text-white">Workspace Files</span>
      </div>
    </aside>
  );
};
