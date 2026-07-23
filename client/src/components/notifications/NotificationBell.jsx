import React from 'react';
import { Bell } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const NotificationBell = ({ count = 0, onClick }) => {
  return (
    <div className="relative select-none inline-block">
      <IconButton icon={Bell} variant="ghost" size="md" onClick={onClick} aria-label="Toggle alerts" />
      {count > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
          {count}
        </span>
      )}
    </div>
  );
};
