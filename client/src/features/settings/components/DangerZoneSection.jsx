import React from 'react';
import { AlertTriangle, Trash2, LogOut, RotateCcw } from 'lucide-react';

export const DangerZoneSection = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone & Destructive Actions
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Irreversible actions regarding your account, stored data, and active sessions</p>
      </div>

      <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Reset All Settings to Factory Defaults</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Reverts notification, theme, coding editor, and dashboard preferences</p>
          </div>
          <button
            onClick={() => alert('Settings reset to default!')}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset Settings
          </button>
        </div>

        <div className="h-px bg-rose-500/20" />

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">Deactivate CodeSphere Account</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Temporarily hides your profile and pauses active subscriptions</p>
          </div>
          <button
            onClick={() => alert('Account deactivation requested.')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-900/30"
          >
            Deactivate Account
          </button>
        </div>

        <div className="h-px bg-rose-500/20" />

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">Permanently Delete Account & All Data</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Permanently purges all sandboxes, Codex repos, test certificates, and profile data</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you absolutely sure you want to permanently delete your CodeSphere account? This action CANNOT be undone!')) {
                alert('Account deletion request queued.');
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-950/60"
          >
            <Trash2 className="w-4 h-4" /> Permanently Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
