import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Code, Terminal, Save, Settings } from 'lucide-react';
import { selectCodingSettings, saveSettingsSectionThunk } from '../redux';

export const CodingPreferencesSection = () => {
  const dispatch = useDispatch();
  const coding = useSelector(selectCodingSettings);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      preferredLanguage: formData.get('preferredLanguage'),
      editorTheme: formData.get('editorTheme'),
      tabSize: Number(formData.get('tabSize')),
      fontFamily: formData.get('fontFamily'),
      fontSize: Number(formData.get('fontSize')),
      autoSave: formData.get('autoSave'),
      compilerDefaults: formData.get('compilerDefaults'),
    };
    dispatch(saveSettingsSectionThunk('coding', updated));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Coding & Editor Preferences
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Configure Monaco editor themes, tab size, font family, auto-format, and compiler defaults</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Programming Language</label>
          <select
            name="preferredLanguage"
            defaultValue={coding.preferredLanguage}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="javascript">JavaScript (ES2024)</option>
            <option value="typescript">TypeScript 5.4</option>
            <option value="python">Python 3.12</option>
            <option value="cpp">C++ 20</option>
            <option value="java">Java 21</option>
            <option value="go">Go 1.22</option>
            <option value="rust">Rust 2021</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Monaco Editor Theme</label>
          <select
            name="editorTheme"
            defaultValue={coding.editorTheme}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
          >
            <option value="vs-dark">VS-Dark (CodeSphere Dark)</option>
            <option value="monokai">Monokai Pro</option>
            <option value="github-dark">GitHub Dark Dimmed</option>
            <option value="one-dark-pro">One Dark Pro</option>
            <option value="dracula">Dracula Official</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tab Indentation Size</label>
          <select
            name="tabSize"
            defaultValue={coding.tabSize}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="8">8 Spaces</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Editor Font Family</label>
          <input
            type="text"
            name="fontFamily"
            defaultValue={coding.fontFamily}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Auto Save Strategy</label>
          <select
            name="autoSave"
            defaultValue={coding.autoSave}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          >
            <option value="afterDelay">After Delay (1000ms)</option>
            <option value="onFocusChange">On Focus Change</option>
            <option value="off">Disabled (Manual Ctrl+S)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Compiler / Runtime Defaults</label>
          <input
            type="text"
            name="compilerDefaults"
            defaultValue={coding.compilerDefaults}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
          />
        </div>

        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Coding Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
