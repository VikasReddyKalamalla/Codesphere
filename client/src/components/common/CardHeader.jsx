import React from 'react';
import clsx from 'clsx';

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx(
        'px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
