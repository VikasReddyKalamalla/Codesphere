import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Search, ChevronDown, BookOpen, Code2, Lock, ChevronRight,
  Flame, Star, BarChart2, Zap, Cpu, Terminal, Shield, Layers,
  CheckCircle2, Sparkles, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCoursesAPI, fetchAllProgressAPI, enrollAPI, unenrollAPI
} from '../services/learningAPI.js';
import { NATIVE_ROADMAPS } from '../data/nativeRoadmapsData.js';

/* ── Category styling & icons ───────────────────────────────── */
const CAT_CONFIG = {
  'Web Development':    { icon: Zap,       color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30' },
  'Backend':            { icon: Terminal,  color: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30' },
  'Data Science':       { icon: BarChart2, color: 'from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/30' },
  'DevOps & Cloud':     { icon: Code2,     color: 'from-emerald-500/20 to-teal-500/20 text-[#04AA6D] border-emerald-500/30' },
  'Security':           { icon: Lock,      color: 'from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/30' },
  'Mobile Development': { icon: BookOpen,  color: 'from-sky-500/20 to-cyan-500/20 text-sky-500 border-sky-500/30' },
  'Database':           { icon: Layers,    color: 'from-indigo-500/20 to-purple-500/20 text-indigo-500 border-indigo-500/30' },
  'System Design':      { icon: Cpu,       color: 'from-rose-500/20 to-orange-500/20 text-rose-400 border-rose-500/30' },
  'Software Engineering':{ icon: Shield,   color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30' },
  'Management & Career': { icon: Sparkles, color: 'from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/30' }
};

const DIFF = {
  beginner:     { bg: 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/20', label: 'Beginner' },
  intermediate: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Intermediate' },
  advanced:     { bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', label: 'Advanced' },
};

export const Learning = () => {
  const { user } = useSelector((s) => s.auth);

  /* ── state ── */
  const [paths,         setPaths]        = useState([]);
  const [allProgress,   setAllProgress]  = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [activeTab,     setActiveTab]    = useState('all');
  const [selectedCat,   setSelectedCat]  = useState('all');
  const [search,        setSearch]       = useState('');
  const [level,         setLevel]        = useState('');
  const [sortBy,        setSortBy]       = useState('popular');
  const [enrolling,     setEnrolling]    = useState(null);

  /* ── load dataset ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, pg] = await Promise.allSettled([
        fetchCoursesAPI({ limit: 150 }), 
        fetchAllProgressAPI()
      ]);
      const fetched = pr.status === 'fulfilled' ? (pr.value?.data?.paths || pr.value?.data || []) : [];

      const nativeFormatted = NATIVE_ROADMAPS.map(r => ({
        _id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        difficulty: r.difficulty,
        duration: r.duration,
        modules: r.modules,
        totalStudents: 1420 + Math.floor(Math.random() * 500),
        createdBy: { fullName: 'CodeSphere Engineering' }
      }));

      const merged = [...nativeFormatted];
      fetched.forEach(f => {
        if (!merged.some(m => m._id === f._id || m.title.toLowerCase() === f.title?.toLowerCase())) {
          merged.push(f);
        }
      });

      setPaths(merged);
      if (pg.status === 'fulfilled') setAllProgress(pg.value?.data || []);
    } catch {
      const nativeFormatted = NATIVE_ROADMAPS.map(r => ({
        _id: r.id,
        title: r.title,
        description: r.description,
        category: r.category,
        difficulty: r.difficulty,
        duration: r.duration,
        modules: r.modules,
        totalStudents: 1420,
        createdBy: { fullName: 'CodeSphere Engineering' }
      }));
      setPaths(nativeFormatted);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openPath = (path) => {
    window.open(`/learning/${path._id}`, '_blank');
  };

  const getProg    = (id) => allProgress.find(p => (p.learningPathId?._id || p.learningPathId) === id);
  const getPct     = (id) => getProg(id)?.completionPercentage || 0;
  const isEnrolled = (id) => !!getProg(id);
  const isDone     = (id) => getProg(id)?.isCompleted || false;

  const categories = ['all', ...new Set(paths.map(p => p.category).filter(Boolean))];

  const filtered = paths.filter(p => {
    if (activeTab === 'enrolled')  return isEnrolled(p._id);
    if (activeTab === 'completed') return isDone(p._id);
    
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchLvl = !level || p.difficulty === level;
    const matchSearch = !search || 
      p.title?.toLowerCase().includes(search.toLowerCase()) || 
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.modules?.some(m => m.title.toLowerCase().includes(search.toLowerCase()));

    return matchCat && matchLvl && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') return (b.totalStudents || 0) - (a.totalStudents || 0);
    if (sortBy === 'title')   return a.title.localeCompare(b.title);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const enrolledCount = allProgress.length;
  const lessonsTotal  = allProgress.reduce((s,p) => s + (p.completedLessons?.length || 0), 0);
  const overallPct    = enrolledCount ? Math.round(allProgress.reduce((s,p) => s + (p.completionPercentage||0), 0) / enrolledCount) : 0;
  const streak        = user?.dayStreak ?? 7;

  /* ── Single Path Card Component ── */
  const PathCard = ({ path }) => {
    const pct      = getPct(path._id);
    const cfg      = CAT_CONFIG[path.category] || { icon: BookOpen, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
    const CatIcon  = cfg.icon;
    const diff     = DIFF[path.difficulty] || DIFF.beginner;
    const enrolled = isEnrolled(path._id);

    return (
      <div 
        onClick={() => openPath(path)} 
        className="w-full text-left rounded-3xl p-6 transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#04AA6D]/60 dark:hover:border-[#04AA6D]/60 hover:shadow-2xl dark:hover:shadow-[#04AA6D]/5 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-[#04AA6D]/15 transition-all" />

        <div>
          <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
            <div>
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {path.category || 'General'}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white font-mono group-hover:text-[#04AA6D] transition-colors leading-snug mt-0.5">
                {path.title}
              </h3>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${cfg.color}`}>
              <CatIcon className="w-5.5 h-5.5" />
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4 font-sans relative z-10">
            {path.description}
          </p>
        </div>

        <div>
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border ${diff.bg}`}>
              {diff.label}
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              {path.modules?.length || 6} Modules
            </span>
            {enrolled && (
              <span className="text-[10px] font-mono font-bold text-[#04AA6D] bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 size={11} /> {pct}% Done
              </span>
            )}
          </div>

          {/* Module Topics Highlights */}
          {path.modules && path.modules.length > 0 && (
            <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap gap-1.5 relative z-10">
              {path.modules.slice(0, 3).map((m, idx) => (
                <span key={idx} className="text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded-md border border-slate-200/40 dark:border-slate-800">
                  • {m.title}
                </span>
              ))}
            </div>
          )}

          {/* Card Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#04AA6D] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {(path.createdBy?.fullName || 'C')[0]}
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 font-mono">
                {path.createdBy?.fullName || 'CodeSphere Eng'}
              </span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); openPath(path); }}
              className="px-3.5 py-1.5 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Roadmap</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full text-slate-900 dark:text-slate-100 select-none pb-16 font-sans">

      {/* ── Page Header ── */}
      <div className="mb-6 text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#04AA6D]/10 text-[#04AA6D] border border-[#04AA6D]/30 uppercase">
              OFFICIAL TECH ROADMAPS
            </span>
            <span className="text-xs font-mono text-slate-400">• {paths.length} Complete Pathways</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight mt-1">
            Student Learning Paths & Skill Trees
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Master computer science, AI, web development, cloud, system design, and algorithms with accurate PDF-derived roadmaps.
          </p>
        </div>
      </div>

      {/* ── Featured Interactive Compiler Banner ── */}
      <div className="mb-6 p-6 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden transition-colors duration-200">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-emerald-500/10 dark:bg-[#04AA6D]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-left relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-[#04AA6D]/20 border border-emerald-200 dark:border-[#04AA6D]/40 flex items-center justify-center text-2xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 dark:bg-[#04AA6D]/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-200 dark:border-[#04AA6D]/30 uppercase">LIVE COMPILER & DSA ROADMAP</span>
              <span className="text-xs text-slate-500 dark:text-slate-300 font-semibold">• LeetCode Problems & Playpen</span>
            </div>
            <h2 className="text-lg font-black mt-1 text-slate-900 dark:text-white font-mono">Data Structures, Algorithms & Real-time Compiler</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              Solve LeetCode-style algorithms with live Python/JS/C++/Java compilation, test case runners, visual graphs, and progressive hints.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open('/dsa', '_blank')}
          className="px-6 py-3 bg-[#04AA6D] hover:bg-emerald-600 font-bold text-xs text-white rounded-2xl shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-500/30 relative z-10"
        >
          <span>Open DSA Compiler Sandbox ↗</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Filter Tabs (All / Enrolled / Completed) ── */}
      <div className="flex items-center gap-2 mb-5 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          ['all',       'All Learning Paths'],
          ['enrolled',  `Enrolled (${enrolledCount})`],
          ['completed', 'Completed Tracks']
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-[#04AA6D] text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Category Pill Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 no-scrollbar select-none text-left">
        <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 uppercase tracking-widest mr-1">
          Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all cursor-pointer border ${
              selectedCat === cat
                ? 'bg-[#04AA6D]/15 text-[#04AA6D] border-[#04AA6D]/40 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* ── Search + Level Selectors ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <Search className="w-4 h-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 83+ roadmaps (e.g. AWS, Angular, C++, LeetCode, Next.js)..."
            className="flex-1 text-xs bg-transparent outline-none text-slate-800 dark:text-slate-200 font-mono placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[130px] shadow-xs">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full appearance-none bg-transparent outline-none text-xs font-mono text-slate-700 dark:text-slate-300 pr-6 cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative flex items-center px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[140px] shadow-xs">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none bg-transparent outline-none text-xs font-mono text-slate-700 dark:text-slate-300 pr-6 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="title">Alphabetical</option>
            <option value="newest">Newest First</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Main Catalog Grid ── */}
      <div className="w-full text-left">
        <div className="flex items-center justify-between px-1 mb-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Available Skill Pathways ({sorted.length})
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-3 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#04AA6D] border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-slate-400">Loading catalog of 83 roadmaps...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <BookOpen className="w-10 h-10 mb-3 text-slate-400" />
            <p className="text-xs font-mono text-slate-400">No learning paths match your filters</p>
            <button 
              onClick={() => { setSearch(''); setSelectedCat('all'); setLevel(''); }}
              className="mt-3 text-xs font-mono text-[#04AA6D] font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {sorted.map((path) => <PathCard key={path._id} path={path} />)}
          </div>
        )}
      </div>

    </div>
  );
};

export default Learning;
