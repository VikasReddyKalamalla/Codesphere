import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { selectPrivacySettings, saveSettingsSectionThunk } from '../redux';

export const PrivacySection = () => {
  const dispatch = useDispatch();
  const privacy = useSelector(selectPrivacySettings);

  const handleToggle = (key, val) => {
    dispatch(saveSettingsSectionThunk('privacy', { [key]: !val }));
  };

  const toggles = [
    { key: 'hideEmail', label: 'Hide Email Address from Public Profile', val: privacy.hideEmail },
    { key: 'hidePhone', label: 'Hide Phone Number from Public Profile', val: privacy.hidePhone },
    { key: 'hideActivity', label: 'Hide Sandbox & Coding Activity Feeds', val: privacy.hideActivity },
    { key: 'hideProgress', label: 'Hide Learning Progress & Course Metrics', val: privacy.hideProgress },
    { key: 'hideCertificates', label: 'Hide Verified Certificates', val: privacy.hideCertificates },
    { key: 'hideAchievements', label: 'Hide Skill Badges & Achievements', val: privacy.hideAchievements },
    { key: 'hideProjects', label: 'Hide Private Codex Repositories', val: privacy.hideProjects },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Privacy & Visibility Controls
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Control who can message you, view your profile data, and follow your learning tracks</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Granular Privacy Toggles</h3>
        <div className="flex flex-col gap-3">
          {toggles.map((item) => (
            <div key={item.key} className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.label}</span>
              <button
                type="button"
                onClick={() => handleToggle(item.key, item.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  item.val
                    ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.val ? 'Hidden' : 'Visible'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
