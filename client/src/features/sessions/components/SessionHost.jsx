import React from 'react';
import { Avatar } from '@components/common/Avatar.jsx';

export const SessionHost = ({ host = {} }) => {
  return (
    <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
      <Avatar src={host.avatar} alt={host.name} size="md" status="online" />
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-800 dark:text-white">{host.name || 'Mentor'}</span>
        <span className="text-[9px] text-slate-450 uppercase font-semibold">Tutor</span>
      </div>
    </div>
  );
};
