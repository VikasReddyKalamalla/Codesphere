import React, { useState } from 'react';
import { Award, Plus, Search, CheckCircle2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export default function InstructorCertificatesPage() {
  const [certs] = useState([
    { id: 'CERT-CS-8921', student: 'Sarah Jenkins', course: 'React 19 System Architecture', date: 'August 4, 2026', status: 'Issued' },
    { id: 'CERT-CS-4310', student: 'James Miller', course: 'Python System Compilers', date: 'August 1, 2026', status: 'Issued' }
  ]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Course Completion Certificates</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Issue verifiable course completion certificates with unique hash signatures (`CERT-CS-XXXX`).
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('Manual certificate issue modal opened')}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Issue Certificate
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase font-mono text-slate-400">
                <th className="py-4 px-6">Certificate Hash</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Course Completed</th>
                <th className="py-4 px-6">Issue Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
              {certs.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-amber-600 dark:text-amber-400">{c.id}</td>
                  <td className="py-4 px-6 font-sans font-bold text-slate-900 dark:text-white">{c.student}</td>
                  <td className="py-4 px-6 font-sans">{c.course}</td>
                  <td className="py-4 px-6">{c.date}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => toast.success(`Downloading PDF certificate ${c.id}`)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
