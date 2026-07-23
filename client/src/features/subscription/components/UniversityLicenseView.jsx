import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, Send } from 'lucide-react';
import { verifyUniversityAPI } from '../services/subscriptionAPI';

export const UniversityLicenseView = () => {
  const [universityName, setUniversityName] = useState('');
  const [domain, setDomain] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyUniversityAPI({ universityName, domain, contactPerson, contactEmail });
      setSubmitted(true);
    } catch (err) {
      alert('Verification request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Campus & University License Portal
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Bulk student licensing, department access, and verified .edu domain pass</p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-emerald-500/40 text-center flex flex-col items-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-[#04AA6D] dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">University License Request Submitted!</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md">
            Our education team will verify your campus domain <span className="text-[#04AA6D] dark:text-emerald-300 font-mono font-bold">{domain}</span> and send bulk student provisioning keys within 24 hours.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Submit Campus Domain Verification</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300">University / Institution Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300">Campus Email Domain</label>
              <input
                type="text"
                required
                placeholder="e.g. stanford.edu"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300">Contact Faculty / Dean Name</label>
              <input
                type="text"
                required
                placeholder="Dr. Robert Vance"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-slate-700 dark:text-slate-300">Official Contact Email</label>
              <input
                type="email"
                required
                placeholder="rvance@stanford.edu"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Request Campus License & Student Discount
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
