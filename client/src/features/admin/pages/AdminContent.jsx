import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, BookOpen, HardDrive, MessageSquare, Calendar, Video,
  RefreshCw, Plus, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export default function AdminContentPage() {
  const [stats, setStats] = useState({
    learningPaths: 83,
    resources: 32,
    communities: 14,
    events: 8,
    sessions: 4
  });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/statistics');
      if (res.data?.data) {
        setStats(prev => ({ ...prev, ...res.data.data }));
      }
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const contentModules = [
    { title: 'Learning Paths & Courses', count: stats.learningPaths, desc: 'Manage 83 PDF-extracted tech roadmaps, modules, and lessons.', icon: BookOpen, path: '/admin/learning', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { title: 'Platform Resources & Notes', count: stats.resources, desc: 'Review uploaded ZIP files, cheat sheets, and PDF notes.', icon: HardDrive, path: '/admin/resources', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Communities & Discussion Forums', count: stats.communities, desc: 'Moderate user communities, suspend spam forums, and manage moderators.', icon: MessageSquare, path: '/admin/communities', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
    { title: 'Hackathons & Platform Events', count: stats.events, desc: 'Schedule coding competitions, workshops, and manage prize pools.', icon: Calendar, path: '/admin/events', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { title: 'Live WebRTC Workshops', count: stats.sessions, desc: 'Monitor active WebRTC sessions, live lectures, and classroom feeds.', icon: Video, path: '/admin/sessions', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Global Platform Content Hub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Centralized dashboard for all courses, downloadable resources, communities, hackathons, and WebRTC sessions.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Content Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contentModules.map((mod, idx) => {
          const Icon = mod.icon;
          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-sky-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`p-3 rounded-2xl border ${mod.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {mod.count}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {mod.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link
                  to={mod.path}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white rounded-xl text-xs font-extrabold font-mono transition-all flex items-center gap-2"
                >
                  Manage Module <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
