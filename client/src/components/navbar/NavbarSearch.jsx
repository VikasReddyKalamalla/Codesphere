import React from 'react';
import { Search } from 'lucide-react';

export const NavbarSearch = ({ value, onChange, placeholder = 'Search lessons, playpens, users...' }) => {
  return (
    <div className="relative w-full max-w-md hidden md:block">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder-slate-500"
      />
    </div>
  );
};
