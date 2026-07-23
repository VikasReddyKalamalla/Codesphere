import React from 'react';

export const SandboxFiles = ({ files = ['App.js', 'package.json'] }) => {
  return (
    <div className="flex flex-col gap-1">
      {files.map((f, idx) => (
        <span key={idx} className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer py-1 font-semibold">{f}</span>
      ))}
    </div>
  );
};
