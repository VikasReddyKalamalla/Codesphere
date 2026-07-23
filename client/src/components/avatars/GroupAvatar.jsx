import React from 'react';
import { Avatar } from '../common/Avatar.jsx';

export const GroupAvatar = ({ users = [], max = 4, size = 'sm' }) => {
  const visibleUsers = users.slice(0, max);
  const remaining = users.length - max;

  const sizeOffset = {
    xs: '-space-x-1.5',
    sm: '-space-x-2',
    md: '-space-x-3',
  };

  return (
    <div className={`flex items-center ${sizeOffset[size] || '-space-x-2'}`}>
      {visibleUsers.map((usr, idx) => (
        <Avatar
          key={idx}
          src={usr.avatar}
          alt={usr.name}
          size={size}
          className="ring-2 ring-white dark:ring-slate-900"
        />
      ))}
      {remaining > 0 && (
        <div className="relative shrink-0 select-none">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 ring-2 ring-white dark:ring-slate-900">
            +{remaining}
          </div>
        </div>
      )}
    </div>
  );
};
