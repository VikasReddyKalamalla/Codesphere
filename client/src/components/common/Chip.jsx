import React from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

export const Chip = ({
  label,
  onDelete,
  className = '',
  ...props
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    >
      {label}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
