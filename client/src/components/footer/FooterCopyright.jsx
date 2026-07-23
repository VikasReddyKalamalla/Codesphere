import React from 'react';
import { Link } from 'react-router-dom';

export const FooterCopyright = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
      <p className="text-xs text-slate-450 dark:text-slate-500">
        &copy; {new Date().getFullYear()} CodeSphere. All rights reserved. Built for creators.
      </p>
      <div className="flex gap-4 text-xs">
        <Link to="/privacy" className="text-slate-450 hover:text-slate-750 dark:text-slate-500 dark:hover:text-slate-350">
          Privacy Policy
        </Link>
        <Link to="/terms" className="text-slate-450 hover:text-slate-750 dark:text-slate-500 dark:hover:text-slate-350">
          Terms of Use
        </Link>
      </div>
    </div>
  );
};
