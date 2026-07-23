import React from 'react';

export const UserTable = ({ list = [] }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs select-none shadow-sm">
      <div className="grid grid-cols-3 bg-slate-50 dark:bg-slate-900 p-3 font-bold text-slate-500 border-b border-slate-100 dark:border-slate-850">
        <span>User Name</span>
        <span>Role</span>
        <span>Account status</span>
      </div>
      {list.map((u, idx) => (
        <div key={idx} className="grid grid-cols-3 p-3 border-b border-slate-100 dark:border-slate-850 last:border-b-0">
          <span className="font-semibold text-slate-750 dark:text-slate-350">{u.name}</span>
          <span>{u.role}</span>
          <span className="text-emerald-500 font-bold uppercase text-[9px]">{u.status || 'Active'}</span>
        </div>
      ))}
    </div>
  );
};
