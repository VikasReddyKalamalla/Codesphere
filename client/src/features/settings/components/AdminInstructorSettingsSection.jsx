import React from 'react';
import { ShieldCheck, Wrench, AlertOctagon, GraduationCap } from 'lucide-react';

export const AdminInstructorSettingsSection = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Admin & Instructor Global Settings
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage platform feature flags, maintenance mode, teaching defaults, and live workshop configuration</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Platform Maintenance Mode</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Restrict student access during scheduled system upgrades</p>
          </div>
          <button
            onClick={() => alert('Toggled maintenance mode')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
          >
            Disabled
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800" />

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Instructor Teaching Defaults</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Default video resolution, automated test grading, and student visibility</p>
          </div>
          <button
            onClick={() => alert('Updated instructor defaults')}
            className="px-4 py-2 rounded-xl bg-[#04AA6D] text-white text-xs font-bold cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};
