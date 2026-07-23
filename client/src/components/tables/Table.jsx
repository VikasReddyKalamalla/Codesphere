import React from 'react';
import clsx from 'clsx';

export const Table = ({ children, className = '' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className={clsx('min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm', className)}>
        {children}
      </table>
    </div>
  );
};
