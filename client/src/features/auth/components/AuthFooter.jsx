import React from 'react';
import { Link } from 'react-router-dom';

export const AuthFooter = ({ question, actionLabel, actionPath }) => (
  <p className="text-center text-xs font-sans-origin text-slate-500">
    {question}{' '}
    <Link to={actionPath} className="font-bold text-[#04AA6D] hover:text-[#03935e] transition-colors ml-1">
      {actionLabel}
    </Link>
  </p>
);
