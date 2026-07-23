import React from 'react';
import clsx from 'clsx';

export const TableRow = ({ children, className = '', hover = true }) => {
  return (
    <tr className={clsx('transition-colors', hover && 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40', className)}>
      {children}
    </tr>
  );
};
