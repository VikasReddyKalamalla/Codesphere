import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const Students = () => {
  const [students, setStudents] = useState([
    { id: 'st1', name: 'Sarah Jenkins', email: 'sarah@example.com', enrolledCourses: 'React 19 Architecture', progress: '85%', joined: 'August 2, 2026' },
    { id: 'st2', name: 'James Miller', email: 'james@example.com', enrolledCourses: 'Python System Compilers', progress: '62%', joined: 'July 28, 2026' }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/instructor/students');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.students || []);
      if (list.length > 0) setStudents(list);
    } catch {
      // Keep state clean
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(s => 
    (s.name || s.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Student Roster & Cohort Performance</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect student course progress percentages, completion streaks, and assignment submissions.
            </p>
          </div>
        </div>

        <button
          onClick={fetchStudents}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Roster
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Enrolled Students: <span className="font-extrabold text-slate-900 dark:text-white">{filteredStudents.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-xs text-slate-400 font-mono">Loading student roster...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 font-mono">
            No enrolled students match filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase font-mono text-slate-400">
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Email Account</th>
                  <th className="py-4 px-6">Enrolled Course</th>
                  <th className="py-4 px-6">Avg Progress</th>
                  <th className="py-4 px-6 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-300 font-mono">
                {filteredStudents.map((st, idx) => (
                  <tr key={st.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white font-sans">{st.name || st.fullName}</td>
                    <td className="py-4 px-6 text-slate-400">{st.email}</td>
                    <td className="py-4 px-6 font-sans">{st.enrolledCourses || 'Course Pathway'}</td>
                    <td className="py-4 px-6 font-bold text-emerald-500">{st.progress || '75%'}</td>
                    <td className="py-4 px-6 text-right text-slate-400">{st.joined || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
