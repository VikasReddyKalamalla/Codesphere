import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Save, Check } from 'lucide-react';
import { selectDashboardSettings, saveSettingsSectionThunk } from '../redux';

export const DashboardPreferencesSection = () => {
  const dispatch = useDispatch();
  const dash = useSelector(selectDashboardSettings);

  const handleSetLayout = (layout) => {
    dispatch(saveSettingsSectionThunk('dashboard', { defaultLayout: layout }));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layout className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Dashboard & Homepage Preferences
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Reorder widgets, set favorite quick access cards, and choose your default dashboard layout</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { id: 'standard', name: 'Standard Layout', desc: 'Balanced view with course progress, upcoming sessions & AI suggestions' },
          { id: 'compact', name: 'Compact Developer Grid', desc: 'High-density grid focusing on active sandboxes and Codex repos' },
          { id: 'analytics', name: 'Analytics Focus', desc: 'Emphasizes test scores, skill charts & monthly learning stats' },
        ].map((l) => {
          const isSelected = dash.defaultLayout === l.id;
          return (
            <button
              key={l.id}
              onClick={() => handleSetLayout(l.id)}
              className={`p-5 rounded-3xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/10 border-2 border-emerald-500 text-slate-900 dark:text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-500/40'
              }`}
            >
              <div>
                <h4 className="text-sm font-bold">{l.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{l.desc}</p>
              </div>
              {isSelected && <span className="text-xs font-bold text-[#04AA6D] dark:text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Active Layout</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
