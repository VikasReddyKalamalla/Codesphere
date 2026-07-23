import React from 'react';
import clsx from 'clsx';

export const TextArea = React.forwardRef(({
  label,
  error,
  helperText,
  rows = 4,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={clsx(
          'block w-full rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed dark:bg-slate-900 dark:disabled:bg-slate-950 px-3.5 py-2.5',
          error
            ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-rose-500 focus:border-rose-500 dark:border-rose-800 dark:text-rose-400'
            : 'border-slate-300 text-slate-950 placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:text-white dark:placeholder-slate-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

TextArea.displayName = 'TextArea';
