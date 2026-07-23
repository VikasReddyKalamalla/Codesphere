import React, { useState } from 'react';
import { RichTextEditor } from './RichTextEditor.jsx';

export const MarkdownEditor = ({ value = '', onChange, label }) => {
  const [activeTab, setActiveTab] = useState('write');

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
        {label && <span className="text-sm font-semibold text-slate-800 dark:text-white">{label}</span>}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg ${activeTab === 'write' ? 'bg-indigo-50 text-indigo-705 dark:bg-indigo-950/40 dark:text-indigo-400' : 'text-slate-400'}`}
          >
            Markdown Write
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg ${activeTab === 'preview' ? 'bg-indigo-50 text-indigo-705 dark:bg-indigo-950/40 dark:text-indigo-400' : 'text-slate-400'}`}
          >
            Parsed View
          </button>
        </div>
      </div>
      {activeTab === 'write' ? (
        <RichTextEditor value={value} onChange={onChange} placeholder="Use raw markdown tags here..." />
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg p-4 min-h-[160px] text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {value || <span className="text-slate-400">Empty workspace canvas. Enter markdown elements to view.</span>}
        </div>
      )}
    </div>
  );
};
