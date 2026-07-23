import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlaskConical, Sparkles, Check } from 'lucide-react';
import { selectExperimentalSettings, saveSettingsSectionThunk } from '../redux';

export const ExperimentalFeaturesSection = () => {
  const dispatch = useDispatch();
  const exp = useSelector(selectExperimentalSettings);

  const handleToggle = (key, val) => {
    dispatch(saveSettingsSectionThunk('experimental', { [key]: !val }));
  };

  const features = [
    { key: 'betaFeatures', name: 'CodeSphere Labs Beta Features', desc: 'Get early access to upcoming sandbox features and UI experiments', val: exp.betaFeatures },
    { key: 'aiBeta', name: 'AI Autonomous Agent Coding Mode', desc: 'Enable multi-file automated code editing via AI prompt assistant', val: exp.aiBeta },
    { key: 'labs', name: 'WebGPU 3D Shader Sandbox', desc: 'Experimental WebGPU compilation runner for high-performance graphics', val: exp.labs },
    { key: 'earlyAccess', name: 'Early Release Program', desc: 'Receive platform updates 48 hours before official deployment', val: exp.earlyAccess },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Experimental Features & Labs
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Opt-in to beta features, autonomous AI coding assistants, and experimental compiler runners</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {features.map((f) => (
          <div key={f.key} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{f.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(f.key, f.val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                f.val
                  ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f.val ? 'Active Beta' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
