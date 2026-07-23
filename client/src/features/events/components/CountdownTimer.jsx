import React, { useState, useEffect } from 'react';

export const CountdownTimer = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center select-none shadow-sm max-w-xs mx-auto">
      <span className="text-[10px] font-bold text-slate-400 uppercase">Registration Ends In</span>
      <span className="text-lg font-bold font-mono text-slate-805 dark:text-white mt-1">02d : 08h : 45m</span>
    </div>
  );
};
