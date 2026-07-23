import React from 'react';
import { History, ShieldCheck, Activity } from 'lucide-react';

export const ActiveSessionsSection = () => {
  const sessions = [
    { id: 1, action: 'Successful Login', browser: 'Chrome 126 on Windows 11', ip: '127.0.0.1', time: 'Just Now', status: 'active' },
    { id: 2, action: 'OAuth Token Refresh', browser: 'CodeSphere VS Code Plugin', ip: '127.0.0.1', time: '2 hours ago', status: 'completed' },
    { id: 3, action: 'Successful Login', browser: 'Safari 17 on macOS', ip: '192.168.1.45', time: 'Yesterday at 18:30', status: 'completed' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Active Sessions & Login Audit Log
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Review recent authentication sessions, API token refreshes, and security activity</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-950/80 text-[#04AA6D] dark:text-emerald-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Event</th>
              <th className="p-4">Client / Device</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Time</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {sessions.map((s) => (
              <tr key={s.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#04AA6D]" /> {s.action}
                </td>
                <td className="p-4">{s.browser}</td>
                <td className="p-4 font-mono">{s.ip}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{s.time}</td>
                <td className="p-4 font-mono uppercase text-[10px] text-emerald-500">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
