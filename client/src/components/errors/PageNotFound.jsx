import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../common/Button.jsx';

export const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-full border border-indigo-100 dark:border-indigo-900/50 mb-4 shrink-0">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">404 - Page Missing</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        The link you followed might be broken, or the directory coordinates could have changed.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Go back home
        </Button>
      </Link>
    </div>
  );
};
