import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
