import React from 'react';
import { Link2, Check } from 'lucide-react';

export const ConnectedAccountsSection = () => {
  const accounts = [
    { name: 'GitHub', desc: 'Sync Codex repositories and gist snippets', connected: true },
    { name: 'Google', desc: 'Single Sign-On and Google Calendar integration', connected: true },
    { name: 'LinkedIn', desc: 'Share verified course certificates and badges', connected: false },
    { name: 'Microsoft', desc: 'Azure & Outlook Calendar integration', connected: false },
    { name: 'Discord', desc: 'Receive community alerts & live event webhooks', connected: false },
    { name: 'Slack', desc: 'Receive team notifications & daily progress digests', connected: false },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Connected Accounts & OAuth SSO
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage third-party authentication providers and social profile connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{acc.desc}</p>
            </div>
            <button
              onClick={() => alert(`Toggled ${acc.name} connection`)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                acc.connected
                  ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {acc.connected ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
