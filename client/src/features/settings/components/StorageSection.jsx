import React from 'react';
import { HardDrive, Trash2 } from 'lucide-react';

export const StorageSection = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Cloud Storage & Cache Management
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Monitor cloud quota usage across sandbox instances, Codex projects, and browser cache</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-900 dark:text-white font-bold">Storage Used: 340 MB</span>
          <span className="text-slate-500 dark:text-slate-400">Total Quota: 5,120 MB (5 GB)</span>
        </div>

        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#04AA6D] to-teal-600 rounded-full w-[7%]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500">Sandbox Code</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">180 MB</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500">Codex Repos</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">95 MB</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500">Course PDF Assets</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">45 MB</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500">Local Cache</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white">20 MB</div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => alert('Local cache cleared!')}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Clear Local App Cache
          </button>
        </div>
      </div>
    </div>
  );
};
