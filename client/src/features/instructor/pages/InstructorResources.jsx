import React, { useState } from 'react';
import { HardDrive, Plus, Download, FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorResources = () => {
  const [resources] = useState([
    { id: 'r1', name: 'Node.js WebSockets Boilerplate.zip', size: '4.8 MB', downloads: '180 downloads', date: 'August 2, 2026' },
    { id: 'r2', name: 'Database Seed Scripts.sql', size: '12 KB', downloads: '92 downloads', date: 'August 1, 2026' }
  ]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Instructor Resource Repository</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload downloadable PDFs, ZIP project templates, and code cheatsheets for your courses.
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('Upload file modal opened')}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {resources.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-sky-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>Size: {item.size}</span>
                <span>• {item.downloads}</span>
                <span>• Uploaded: {item.date}</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Downloading ${item.name}`)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorResources;
