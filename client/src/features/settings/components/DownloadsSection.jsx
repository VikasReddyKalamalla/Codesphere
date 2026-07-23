import React from 'react';
import { Download, Trash2, FileText } from 'lucide-react';

export const DownloadsSection = () => {
  const downloads = [
    { id: 1, name: 'System_Architecture_Guide.pdf', size: '4.2 MB', date: 'Yesterday' },
    { id: 2, name: 'Verified_React_Architect_Certificate.pdf', size: '1.8 MB', date: '3 days ago' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Offline Downloads & Resource Files
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Manage downloaded course materials, certificates, and offline sandbox templates</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
          {downloads.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#04AA6D]" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.size} • Downloaded {item.date}</div>
                </div>
              </div>
              <button
                onClick={() => alert(`Deleted ${item.name}`)}
                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
