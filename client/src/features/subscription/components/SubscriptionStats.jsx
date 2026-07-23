import React from 'react';

export const SubscriptionStats = () => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl select-none">
      <span className="text-[10px] font-bold text-slate-400 uppercase">Usage metrics</span>
      <p className="text-xs text-slate-800 dark:text-slate-350 font-semibold mt-1">45% Sandbox compile seconds remaining</p>
    </div>
  );
};
