import React from 'react';
import { TextArea } from '@components/common/TextArea.jsx';

export const CodeEditor = ({ code, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-bold text-slate-500 uppercase select-none">Source Code Editor</span>
      <textarea
        value={code}
        onChange={(e) => onChange && onChange(e.target.value)}
        rows={12}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-950 text-indigo-400 font-mono text-xs p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm leading-relaxed"
        placeholder="// write playpen codes here..."
      />
    </div>
  );
};
