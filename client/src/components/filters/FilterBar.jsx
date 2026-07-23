import React from 'react';
import clsx from 'clsx';

export const FilterBar = ({ children, className = '' }) => {
  return (
    <div className={clsx('flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800', className)}>
      {children}
    </div>
  );
};
