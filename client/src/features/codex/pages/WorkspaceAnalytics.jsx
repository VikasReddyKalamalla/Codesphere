import React from 'react';
import { BackButton } from '@components/common/BackButton.jsx';

export const WorkspaceAnalytics = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/codex" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-805 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white">Workspace Analytics</h3>
        <p className="text-xs text-slate-400 mt-1">Empty metrics logs for collaborative compilation.</p>
      </div>
    </div>
  );
};
