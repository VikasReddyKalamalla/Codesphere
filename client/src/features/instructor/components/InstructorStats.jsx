import React from 'react';

export const InstructorStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 border border-slate-205 dark:border-slate-800 rounded-xl select-none">
      <div className="flex flex-col text-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Total Students</span>
        <span className="text-base font-extrabold text-slate-850 dark:text-white mt-1">{stats.students || '48'}</span>
      </div>
      <div className="flex flex-col text-center border-x border-slate-200 dark:border-slate-800">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Active Courses</span>
        <span className="text-base font-extrabold text-slate-850 dark:text-white mt-1">{stats.courses || '2'}</span>
      </div>
      <div className="flex flex-col text-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Earnings</span>
        <span className="text-base font-extrabold text-slate-850 dark:text-white mt-1">${stats.earnings || '450'}</span>
      </div>
    </div>
  );
};
