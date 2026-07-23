import React from 'react';

export const StudentTable = ({ list = [] }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs select-none">
      <div className="grid grid-cols-2 bg-slate-50 dark:bg-slate-900 p-3 font-bold text-slate-500 border-b border-slate-100 dark:border-slate-850">
        <span>Student name</span>
        <span>Registered date</span>
      </div>
      {list.length === 0 ? (
        <p className="text-xs text-slate-400 py-4 text-center">No students registered.</p>
      ) : (
        list.map((std, idx) => (
          <div key={idx} className="grid grid-cols-2 p-3 border-b border-slate-100 dark:border-slate-850 last:border-b-0">
            <span className="font-semibold text-slate-750 dark:text-slate-300">{std.name}</span>
            <span className="text-slate-400">{std.date}</span>
          </div>
        ))
      )}
    </div>
  );
};
