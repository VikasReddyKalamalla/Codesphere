import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, RefreshCw, CheckCircle2, Clock, Award, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([
    { id: 'asgn_1', name: 'Build a Custom Express Middleware', deadline: 'August 15, 2026', submissions: '32 submissions', pending: 5 },
    { id: 'asgn_2', name: 'Mongoose Pre-Save Schema Hook Fixes', deadline: 'August 20, 2026', submissions: '14 submissions', pending: 2 }
  ]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Student Assignments Manager</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review homework submissions, inspect student code diffs, and submit grades.
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('New assignment modal opened')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create Assignment
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {assignments.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>Deadline: {item.deadline}</span>
                <span>• {item.submissions}</span>
                <span className="text-amber-500 font-bold">• {item.pending} pending review</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Grading interface opened for ${item.name}`)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors"
            >
              Grade Submissions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorAssignments;
