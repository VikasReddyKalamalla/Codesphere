import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 select-none py-1">
      <Link to="/" className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors flex items-center">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 shrink-0" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-655 dark:text-slate-350 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
