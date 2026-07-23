import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Check } from 'lucide-react';
import { selectAccessibilitySettings, saveSettingsSectionThunk } from '../redux';

export const AccessibilitySection = () => {
  const dispatch = useDispatch();
  const acc = useSelector(selectAccessibilitySettings);

  const handleToggle = (key, val) => {
    dispatch(saveSettingsSectionThunk('accessibility', { [key]: !val }));
  };

  const options = [
    { key: 'screenReaderSupport', label: 'Screen Reader Support & ARIA Labels', desc: 'Enhanced vocalization hints for screen readers', val: acc.screenReaderSupport },
    { key: 'keyboardNavigation', label: 'Keyboard Focus Shortcuts', desc: 'Full tab key & shortcut navigation', val: acc.keyboardNavigation },
    { key: 'highContrastMode', label: 'High Contrast Mode', desc: 'Maximizes contrast for high visibility', val: acc.highContrastMode },
    { key: 'largeText', label: 'Enlarged Text & Headers', desc: 'Increases default UI font scaling', val: acc.largeText },
    { key: 'captionsEnabled', label: 'Live Video Closed Captions', desc: 'Auto-generate captions during live sessions', val: acc.captionsEnabled },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Accessibility & Assistive Features
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Configure screen reader assistance, high contrast, captions, and color blind modes</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt) => (
          <div key={opt.key} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{opt.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(opt.key, opt.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                opt.val
                  ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {opt.val ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
