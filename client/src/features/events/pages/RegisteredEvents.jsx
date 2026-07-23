import React from 'react';
import { BackButton } from '@components/common/BackButton.jsx';

export const RegisteredEvents = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/events" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white">My Registered Events</h3>
        <p className="text-xs text-slate-400 mt-1">You haven't registered for any events yet.</p>
      </div>
    </div>
  );
};
