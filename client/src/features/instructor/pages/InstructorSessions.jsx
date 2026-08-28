import React, { useState, useEffect } from 'react';
import { Video, Plus, RefreshCw, Calendar, Users, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const InstructorSessions = () => {
  const [sessions, setSessions] = useState([
    { id: 's1', title: 'React Performance Workshop', active: '18 students connected', start: 'Today 14:00 UTC', status: 'Live' },
    { id: 's2', title: 'Python Data Science Masterclass', active: '24 students scheduled', start: 'Tomorrow 10:00 UTC', status: 'Upcoming' }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/instructor/sessions');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.sessions || []);
      if (list.length > 0) setSessions(list);
    } catch {
      // Keep state clean
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Live WebRTC Workshops & Lectures</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Schedule interactive video workshops, broadcast screen shares, and manage participant rosters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSessions}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => toast.success('Session creation modal opened')}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Schedule Workshop
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-rose-500/40 transition-colors flex justify-between items-center shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono ${item.status === 'Live' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/30 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                <span>{item.active}</span>
                <span>• Starts: {item.start}</span>
              </div>
            </div>
            <button 
              onClick={() => toast.success(`Launching WebRTC stream for ${item.title}`)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5" /> Start Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorSessions;
