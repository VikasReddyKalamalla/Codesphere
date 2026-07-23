import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Palette, Moon, Sun, Monitor, Check } from 'lucide-react';
import { selectAppearanceSettings, saveSettingsSectionThunk } from '../redux';

export const AppearanceSection = () => {
  const dispatch = useDispatch();
  const appearance = useSelector(selectAppearanceSettings);

  const handleSetTheme = (theme) => {
    dispatch(saveSettingsSectionThunk('appearance', { theme }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Appearance & Theme System
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Customize UI theme, accent colors, sidebar density, font size, and glassmorphic card styles</p>
      </div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { id: 'dark', title: 'CodeSphere Dark', desc: 'Dark theme with glowing emerald accents', icon: Moon },
          { id: 'light', title: 'CodeSphere Light', desc: 'Clean high-contrast light mode', icon: Sun },
          { id: 'system', title: 'System Default', desc: 'Matches your operating system settings', icon: Monitor },
        ].map((t) => {
          const Icon = t.icon;
          const isSelected = appearance.theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleSetTheme(t.id)}
              className={`p-5 rounded-3xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/10 border-2 border-emerald-500 text-slate-900 dark:text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300">
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#04AA6D]" />}
              </div>
              <div>
                <h4 className="text-sm font-bold">{t.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Font & Layout Density Options */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Font Size</label>
          <select
            defaultValue={appearance.fontSize}
            onChange={(e) => dispatch(saveSettingsSectionThunk('appearance', { fontSize: e.target.value }))}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="small">Small (12px)</option>
            <option value="medium">Medium (14px - Default)</option>
            <option value="large">Large (16px)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Layout Density</label>
          <select
            defaultValue={appearance.layoutDensity}
            onChange={(e) => dispatch(saveSettingsSectionThunk('appearance', { layoutDensity: e.target.value }))}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="comfortable">Comfortable (Standard Padding)</option>
            <option value="compact">Compact (Dense Data Grid)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
