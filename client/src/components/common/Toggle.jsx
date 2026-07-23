import React from 'react';
import clsx from 'clsx';

export const Toggle = ({
  checked = false,
  onChange,
  label,
  className = '',
  disabled = false
}) => {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={clsx(
          'w-10 h-6 rounded-full transition-colors duration-200 ease-in-out',
          checked ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
        )} />
        <div className={clsx(
          'absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 ease-in-out transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )} />
      </div>
      {label && (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      )}
    </label>
  );
};
