import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const NavbarMenu = ({ items = [] }) => {
  const location = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-6">
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400',
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-650 dark:text-slate-350'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
