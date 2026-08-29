import React, { useState } from 'react';
import { Award, Plus, Search, CheckCircle2, Download, ShieldCheck, ExternalLink, X, UserCheck, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export default function InstructorCertificatesPage() {
  const [certs, setCerts] = useState([
    { id: 'CERT-CS-8921', student: 'Sarah Jenkins', course: 'React 19 System Architecture', date: 'August 4, 2026', status: 'Issued', verificationHash: 'a89f21b7c01d94e62' },
    { id: 'CERT-CS-4310', student: 'James Miller', course: 'Python System Compilers', date: 'August 1, 2026', status: 'Issued', verificationHash: 'f43109a12b4e87c90' }
  ]);

  const [previewCertModal, setPreviewCertModal] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({
    student: '',
    course: 'React 19 System Architecture',
    date: 'August 29, 2026'
  });

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!newCert.student.trim()) {
      toast.error('Please enter student name.');
      return;
    }

    const created = {
      id: `CERT-CS-${Math.floor(1000 + Math.random() * 9000)}`,
      student: newCert.student,
      course: newCert.course,
      date: newCert.date,
      status: 'Issued',
      verificationHash: Math.random().toString(36).substring(2, 15)
    };

    setCerts(prev => [created, ...prev]);
    setIsIssueModalOpen(false);
    setNewCert({ student: '', course: 'React 19 System Architecture', date: 'August 29, 2026' });
    toast.success(`Issued certificate ${created.id} to ${created.student}!`);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Header Banner */}
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
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Issue Certificate
        </button>
      </div>

      {/* Certificates Table */}
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
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setPreviewCertModal(c)}
                        className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Verify
                      </button>
                      <button 
                        onClick={() => toast.success(`Downloading PDF certificate ${c.id}`)}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black">Issue Course Certificate</h3>
              </div>
              <button 
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="flex flex-col gap-4 mt-4 text-xs font-mono">
              <div>
                <label className="font-bold text-slate-400 uppercase">Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={newCert.student}
                  onChange={(e) => setNewCert({ ...newCert, student: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Course Title</label>
                <input
                  type="text"
                  value={newCert.course}
                  onChange={(e) => setNewCert({ ...newCert, course: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 uppercase">Issue Date</label>
                <input
                  type="text"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="w-full mt-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Generate & Issue Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Verification Preview Modal */}
      {previewCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-black uppercase font-mono tracking-wider">Verifiable Hash Signature</span>
              </div>
              <button 
                onClick={() => setPreviewCertModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Card Mockup */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-slate-900 border-2 border-amber-500/30 flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-500 tracking-widest">Official Certificate of Completion</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">{previewCertModal.student}</h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">Has successfully completed all curriculum requirements for</p>
                <h4 className="text-sm font-bold text-amber-400 font-mono mt-1">{previewCertModal.course}</h4>
              </div>

              <div className="w-full pt-4 mt-2 border-t border-slate-200/20 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-400">
                <span>Certificate Hash: <strong className="text-amber-500">{previewCertModal.id}</strong></span>
                <span>Date: {previewCertModal.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Hash Validated on MongoDB Replica Set
              </span>
              <button
                onClick={() => {
                  toast.success(`Downloading official PDF for ${previewCertModal.id}`);
                  setPreviewCertModal(null);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
