import React from 'react';
import clsx from 'clsx';

export const Tag = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
