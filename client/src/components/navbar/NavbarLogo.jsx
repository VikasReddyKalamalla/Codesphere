import React from 'react';
import { Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none font-bold text-xl text-indigo-600 dark:text-indigo-400">
      <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
        <Code2 className="w-5 h-5" />
      </div>
      <span>CodeSphere</span>
    </Link>
  );
};
