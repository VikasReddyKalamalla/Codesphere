import React, { useState, useEffect } from 'react';
import { 
  GitFork, Plus, RefreshCw, Search, BookOpen, Layers, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BackButton } from '@components/common/BackButton.jsx';
import apiClient from '@services/axios.js';

export const InstructorLearningPaths = () => {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/learning-paths');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.learningPaths || []);
      setPaths(list);
    } catch {
      // Keep state clean
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in text-slate-900 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/instructor" className="self-start" />

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Learning Path Roadmaps</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sequence multi-module learning roadmaps and structured tech curriculums.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => toast.success('Learning path creation window opened')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            Create Roadmap
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-xs text-slate-400 font-mono">Fetching roadmap curriculums...</span>
        </div>
      ) : paths.length === 0 ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-6">
          <GitFork className="w-10 h-10 text-slate-400 mb-2" />
          <p className="text-sm font-bold">No Learning Paths Found</p>
          <p className="text-xs text-slate-500 mt-1">Design a new learning roadmap for your student cohorts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.map((p, idx) => (
            <div key={p._id || idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition-all shadow-sm">
              <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {p.category || 'Roadmap'}
              </span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white mt-2">{p.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorLearningPaths;
