import React from 'react';
import { Avatar } from '@components/common/Avatar.jsx';

export const ProfileHeader = ({ user = {} }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-5 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm select-none">
      <Avatar src={user.avatar} alt={user.name} size="lg" status="online" />
      <div className="flex flex-col text-center md:text-left gap-1">
        <h2 className="text-lg font-extrabold text-slate-850 dark:text-white">{user.name || 'Developer'}</h2>
        <span className="text-xs text-indigo-650 dark:text-indigo-400 font-semibold">{user.headline || 'CodeSphere Member'}</span>
        <span className="text-[10px] text-slate-400 font-medium">{user.location || 'Remote'}</span>
      </div>
    </div>
  );
};
