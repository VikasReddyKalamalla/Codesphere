import React from 'react';
import { ProgressBar } from '@components/common/ProgressBar.jsx';

export const TestProgress = ({ active = 0, total = 10 }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full select-none">
      <div className="flex justify-between text-xs font-semibold text-slate-500">
        <span>Question progress</span>
        <span>{active}/{total} solved</span>
      </div>
      <ProgressBar value={active} max={total} color="bg-indigo-655" />
    </div>
  );
};
