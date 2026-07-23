import React from 'react';
import clsx from 'clsx';

export const Radio = React.forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={id}
          type="radio"
          className={clsx(
            'h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-offset-slate-900 transition-colors',
            error ? 'border-rose-300 focus:ring-rose-500' : '',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400 pl-6">{error}</p>}
    </div>
  );
});

Radio.displayName = 'Radio';
