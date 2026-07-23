import React from 'react';
import { BackButton } from '@components/common/BackButton.jsx';

export const SessionHistory = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/sessions" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-905 dark:text-white">Past Webcasts History</h3>
        <p className="text-xs text-slate-400 mt-1">Empty logs of past webcast stream links.</p>
      </div>
    </div>
  );
};
