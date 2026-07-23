import React from 'react';

export const AuditLogs = ({ list = [] }) => {
  return (
    <div className="flex flex-col gap-3">
      {list.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">No audit trails recorded.</p>
      ) : (
        list.map((log, idx) => (
          <div key={idx} className="text-xs border-b border-slate-50 dark:border-slate-850 pb-2.5 last:border-b-0">
            <span className="text-slate-400 font-bold">{log.time}</span>
            <p className="text-slate-750 dark:text-slate-350 mt-0.5">{log.action}</p>
          </div>
        ))
      )}
    </div>
  );
};
