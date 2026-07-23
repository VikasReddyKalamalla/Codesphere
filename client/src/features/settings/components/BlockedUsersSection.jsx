import React from 'react';
import { Slash, UserX } from 'lucide-react';

export const BlockedUsersSection = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Slash className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Blocked & Muted Users
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage users you have blocked from sending messages or viewing your activity</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-2">
        <UserX className="w-10 h-10 text-slate-400" />
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Blocked Users</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">You have not blocked or muted any community members.</p>
      </div>
    </div>
  );
};
