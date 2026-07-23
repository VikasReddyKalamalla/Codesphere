import React from 'react';
import { FolderKanban } from 'lucide-react';

export const WorkspaceHeader = ({ title = 'Workspace Lobby' }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-5 rounded-xl flex items-center gap-3.5 select-none shadow-sm">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-[#6366f1] rounded-xl">
        <FolderKanban className="w-6 h-6 animate-pulse" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-450">Collaborate with college team members and code modules</p>
      </div>
    </div>
  );
};
