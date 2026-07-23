import React, { useState } from 'react';
import { Bold, Italic, List, Quote } from 'lucide-react';
import { TextArea } from '../common/TextArea.jsx';
import { IconButton } from '../common/IconButton.jsx';

export const RichTextEditor = ({ value = '', onChange, label, placeholder = 'Write details...' }) => {
  const insertText = (markup) => {
    const formatted = markup + value + markup;
    onChange && onChange(formatted);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500">
        <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/60 p-1.5 border-b border-slate-200 dark:border-slate-800">
          <IconButton icon={Bold} variant="ghost" size="sm" onClick={() => insertText('**')} aria-label="Bold font markup" />
          <IconButton icon={Italic} variant="ghost" size="sm" onClick={() => insertText('*')} aria-label="Italic font markup" />
          <IconButton icon={List} variant="ghost" size="sm" onClick={() => insertText('\n- ')} aria-label="Unordered bullet items" />
          <IconButton icon={Quote} variant="ghost" size="sm" onClick={() => insertText('\n> ')} aria-label="Block quote section" />
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="w-full border-0 p-3 text-sm focus:outline-none dark:bg-slate-900 dark:text-white placeholder-slate-400"
        />
      </div>
    </div>
  );
};
