import React from 'react';

export const ActivityFeed = ({ logs = [] }) => {
  return (
    <div className="flex flex-col gap-4 select-none">
      {logs.map((log, idx) => (
        <div key={idx} className="flex gap-3 text-xs leading-relaxed border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0 last:pb-0">
          <span className="text-slate-400 shrink-0">{log.time}</span>
          <span className="text-slate-750 dark:text-slate-350 font-medium">{log.message}</span>
        </div>
      ))}
    </div>
  );
};
