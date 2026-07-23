import React from 'react';
import clsx from 'clsx';

export const PaginationButton = ({ children, active = false, disabled = false, onClick, ...props }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'border px-3 py-1.5 rounded-lg text-xs font-semibold select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        active
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
      )}
      {...props}
    >
      {children}
    </button>
  );
};
