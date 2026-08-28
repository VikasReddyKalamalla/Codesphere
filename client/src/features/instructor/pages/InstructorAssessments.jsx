import React, { useState } from 'react';
import { ClipboardCheck, Plus, Award, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorAssessments = () => {
  const [quizzes] = useState([
    { id: 'q1', name: 'JavaScript Promises & Async/Await Quiz', type: 'MCQ (20 questions)', duration: '30 mins', attempts: 42 },
    { id: 'q2', name: 'React Hooks State Challenge', type: 'Coding Test (2 exercises)', duration: '45 mins', attempts: 28 }
  ]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Assessments & Timed Quizzes</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Conduct timed coding challenges, randomized question banks, and anti-cheat proctored tests.
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('New assessment builder opened')}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          Create Assessment
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {quizzes.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>{item.type}</span>
                <span>• Duration: {item.duration}</span>
                <span>• {item.attempts} student attempts</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Editing assessment: ${item.name}`)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors"
            >
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorAssessments;
