import React from 'react';
import clsx from 'clsx';

export const TableCell = ({ children, className = '', isHeader = false }) => {
  const Component = isHeader ? 'th' : 'td';
  return (
    <Component
      className={clsx(
        'px-6 py-4 font-medium whitespace-nowrap',
        isHeader
          ? 'text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400'
          : 'text-slate-800 dark:text-slate-200',
        className
      )}
    >
      {children}
    </Component>
  );
};
