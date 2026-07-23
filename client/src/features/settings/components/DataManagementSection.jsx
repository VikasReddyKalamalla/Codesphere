import React from 'react';
import { Database, Download } from 'lucide-react';
import { exportUserDataAPI } from '../services/settingsAPI';

export const DataManagementSection = () => {
  const handleExport = async () => {
    try {
      const res = await exportUserDataAPI();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'codesphere-export.json');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Export Personal Data Archive
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Download a full JSON archive containing profile data, learning metrics, certificates, and sandbox files</p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Export GDPR Compliant Archive</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generates a downloadable ZIP/JSON archive of your entire CodeSphere account history.</p>
        </div>
        <button
          onClick={handleExport}
          className="px-5 py-3 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Download My Data Archive
        </button>
      </div>
    </div>
  );
};
