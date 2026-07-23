import React from 'react';
import { Search } from 'lucide-react';
import clsx from 'clsx';

export const SearchInput = React.forwardRef(({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={clsx('relative w-full shadow-sm rounded-lg', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-450">
        <Search className="w-4 h-4" />
      </div>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
