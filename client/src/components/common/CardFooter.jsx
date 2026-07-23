import React from 'react';
import clsx from 'clsx';

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx(
        'px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
