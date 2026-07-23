import React from 'react';

export const DashboardCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 select-none">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Users</span>
        <span className="text-lg font-extrabold text-slate-800 dark:text-white mt-1 block">1,402</span>
      </div>
    </div>
  );
};
