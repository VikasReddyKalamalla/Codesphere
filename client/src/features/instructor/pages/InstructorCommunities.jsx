import React, { useState } from 'react';
import { MessageSquare, Plus, Users, Pin } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';

export const InstructorCommunities = () => {
  const [forums] = useState([
    { id: 'c1', name: 'React 19 Server Components Q&A', replies: '34 replies', active: 'Active today' },
    { id: 'c2', name: 'Job Referrals & Portfolios Review', replies: '12 replies', active: 'Active yesterday' }
  ]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Community Forums & Cohort Channels</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Moderate student discussions, pin cohort announcements, and answer technical questions.
            </p>
          </div>
        </div>

        <button 
          onClick={() => toast.success('New forum creation opened')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
        >
          <Plus size={16} />
          New Channel
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {forums.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>{item.replies}</span>
                <span>• {item.active}</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Channel ${item.name} opened`)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold rounded-xl font-mono transition-colors"
            >
              View Discussions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorCommunities;
