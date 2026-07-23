import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationBell = ({ count = 0 }) => {
  return (
    <div className="relative cursor-pointer p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 select-none">
      <Bell className="w-5 h-5 text-slate-550 dark:text-slate-350" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-slate-900 animate-pulse">
          {count}
        </span>
      )}
    </div>
  );
};
