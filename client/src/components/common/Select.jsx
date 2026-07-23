import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  placeholder,
  ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <select
          ref={ref}
          id={id}
          className={clsx(
            'block w-full appearance-none rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed dark:bg-slate-900 dark:disabled:bg-slate-950 pl-3.5 pr-10 py-2.5',
            error
              ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500 dark:border-rose-800 dark:text-rose-400'
              : 'border-slate-300 text-slate-950 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:text-white',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 dark:text-slate-500">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
