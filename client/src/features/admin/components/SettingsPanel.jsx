import React from 'react';

export const SettingsPanel = () => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-xs select-none">
      <span className="font-bold text-slate-850 dark:text-white">Admin Platform Configurations</span>
      <p className="text-slate-450 mt-1">Configure WebSocket port bounds, compile memory constraints, and email relays.</p>
    </div>
  );
};
