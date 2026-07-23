import React from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

export const SearchInput = React.forwardRef(({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={clsx('relative w-full shadow-sm rounded-lg', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
