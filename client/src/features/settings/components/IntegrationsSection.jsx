import React from 'react';
import { Sliders, Check } from 'lucide-react';

export const IntegrationsSection = () => {
  const tools = [
    { name: 'VS Code Extension', desc: 'CodeSphere Live Pair Programming for VS Code', active: true },
    { name: 'Notion Sync', desc: 'Auto-publish learning path notes & certificates to Notion', active: false },
    { name: 'Figma Plugin', desc: 'Export UI component frames into CodeSphere Sandbox', active: false },
    { name: 'Jira Software', desc: 'Link CodeSphere milestone tasks to Jira issues', active: false },
    { name: 'Google Drive', desc: 'Store backup project archives on Google Drive', active: false },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Platform Integrations & Webhooks
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Connect CodeSphere with VS Code, Notion, Figma, Jira, and cloud file systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((t, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
            </div>
            <button
              onClick={() => alert(`Toggled ${t.name}`)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                t.active
                  ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.active ? 'Enabled' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
