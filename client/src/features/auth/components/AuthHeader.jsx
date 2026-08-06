import React from 'react';

export const AuthHeader = ({ title, subtitle }) => (
  <div className="mb-7 select-none">
    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h1>
    {subtitle && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
  </div>
);
