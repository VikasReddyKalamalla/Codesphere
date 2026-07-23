import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Globe, Save } from 'lucide-react';
import { selectLanguageRegionSettings, saveSettingsSectionThunk } from '../redux';

export const LanguageRegionSection = () => {
  const dispatch = useDispatch();
  const langReg = useSelector(selectLanguageRegionSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = Object.fromEntries(formData.entries());
    dispatch(saveSettingsSectionThunk('languageRegion', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Language, Region & Formats
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Configure interface language, country localization, date/time format, and default currency</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Interface Language</label>
          <select
            name="language"
            defaultValue={langReg.language}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
            <option value="Spanish (Español)">Spanish (Español)</option>
            <option value="French (Français)">French (Français)</option>
            <option value="German (Deutsch)">German (Deutsch)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Country / Region</label>
          <input
            type="text"
            name="country"
            defaultValue={langReg.country}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Date Format</label>
          <select
            name="dateFormat"
            defaultValue={langReg.dateFormat}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY (19/07/2026)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (07/19/2026)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-19 ISO)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Currency Symbol</label>
          <select
            name="currency"
            defaultValue={langReg.currency}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="INR (₹)">INR (₹) - Indian Rupee</option>
            <option value="USD ($)">USD ($) - US Dollar</option>
            <option value="EUR (€)">EUR (€) - Euro</option>
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Regional Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
