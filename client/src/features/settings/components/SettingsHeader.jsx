import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Settings, Search, Check, Loader2 } from 'lucide-react';
import { setSearchQuery, selectSearchQuery, selectSettingsSaving, selectSuccessMessage } from '../redux';

export const SettingsHeader = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const saving = useSelector(selectSettingsSaving);
  const successMsg = useSelector(selectSuccessMessage);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5 z-10">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
            User Settings & Control Center
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Personalize account security, privacy, theme, AI mentor, coding environment, and platform configuration.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
          />
        </div>

        {/* Status Toast Notification */}
        {saving && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-[#04AA6D] text-xs font-bold border border-emerald-500/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 text-xs font-bold border border-emerald-500/30 animate-fade-in">
            <Check className="w-3.5 h-3.5" /> {successMsg}
          </div>
        )}
      </div>
    </div>
  );
};
