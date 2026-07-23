import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const PermissionsSection = () => {
  const apps = [
    { name: 'CodeSphere VS Code Plugin', scopes: ['read:profile', 'write:code'], granted: '2 weeks ago' },
    { name: 'Discord Bot Notifier', scopes: ['read:notifications'], granted: '1 month ago' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Granted Application Permissions
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Review OAuth application permissions and revoke access to connected applications</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {apps.map((app, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{app.name}</h4>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">Scopes: {app.scopes.join(', ')} • Granted {app.granted}</p>
            </div>
            <button
              onClick={() => alert(`Revoked ${app.name}`)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
            >
              Revoke Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
