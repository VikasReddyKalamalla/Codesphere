import React from 'react';
import clsx from 'clsx';

export const Input = React.forwardRef(({
  label, error, helperText, className = '', id, type = 'text', icon: Icon, ...props
}, ref) => (
  <div className="w-full flex flex-col gap-1.5">
    {label && (
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-350">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        className={clsx(
          'block w-full rounded-xl text-sm transition-all border py-2.5 px-4',
          'bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
          error 
            ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30' 
            : 'border-slate-200 dark:border-slate-800 focus:border-[#6366f1] focus:ring-indigo-500/20 dark:focus:ring-[#6366f1]/20',
          'focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          Icon ? 'pl-10' : 'pl-4',
          className,
        )}
        {...props}
      />
    </div>
    {error     && <p className="text-xs text-red-500">{error}</p>}
    {!error && helperText && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
  </div>
));
Input.displayName = 'Input';
