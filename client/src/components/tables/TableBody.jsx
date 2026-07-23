import React from 'react';
import clsx from 'clsx';

export const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={clsx('divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900', className)}>
      {children}
    </tbody>
  );
};
