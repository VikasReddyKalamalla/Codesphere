import React from 'react';
import { BackButton } from '@components/common/BackButton.jsx';

export const Preferences = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/settings" className="self-start" />
      <p className="text-xs text-slate-400">Empty preferences settings logs.</p>
    </div>
  );
};
