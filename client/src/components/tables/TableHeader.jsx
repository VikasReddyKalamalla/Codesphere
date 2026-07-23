import React from 'react';
import clsx from 'clsx';

export const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={clsx('bg-slate-50 dark:bg-slate-900/50', className)}>
      {children}
    </thead>
  );
};
