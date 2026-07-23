import React from 'react';
import { Link } from 'react-router-dom';

export const SearchResults = ({ results = [], query = '', onClose }) => {
  if (!query) return null;

  return (
    <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl shadow-lg z-50 py-2 max-h-80 overflow-y-auto animate-scale-in">
      {results.length === 0 ? (
        <p className="text-xs text-center py-6 text-slate-400">No results found for "{query}"</p>
      ) : (
        results.map((res, idx) => (
          <Link
            key={idx}
            to={res.path}
            onClick={onClose}
            className="flex flex-col gap-0.5 px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
          >
            <span className="text-xs font-semibold text-slate-800 dark:text-white">{res.title}</span>
            <span className="text-[10px] text-slate-400 capitalize">{res.type}</span>
          </Link>
        ))
      )}
    </div>
  );
};
