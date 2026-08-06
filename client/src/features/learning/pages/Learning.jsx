import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Search, ChevronDown, List,
  BookOpen, Play, FileText, Code2,
  CheckCircle2, Lock, ChevronRight, ChevronUp,
  Bookmark, BookmarkCheck, Flame, Star,
  BarChart2, Zap, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCoursesAPI, fetchCourseDetailsAPI,
  fetchAllProgressAPI, fetchPathProgressAPI,
  markLessonCompleteAPI, enrollAPI, unenrollAPI,
} from '../services/learningAPI.js';
import { NATIVE_ROADMAPS } from '../data/nativeRoadmapsData.js';

/* ── helpers ────────────────────────────────────────────────── */

const fmtMins = (m) => {
  if (!m) return '—';
  const h = Math.floor(m / 60), mn = m % 60;
  return h ? `${h}h ${mn > 0 ? mn + 'm' : ''}` : `${mn}m`;
};

const CAT_ICONS = {
  'Web Development':    { icon: Zap,       bg: 'bg-amber-500/10 text-amber-500' },
  'Data Science':       { icon: BarChart2,  bg: 'bg-purple-500/10 text-purple-500' },
  'Mobile Development': { icon: BookOpen,   bg: 'bg-blue-500/10 text-blue-500' },
  'DevOps':             { icon: Code2,      bg: 'bg-emerald-500/10 text-[#04AA6D]' },
  'System Design':      { icon: BarChart2,  bg: 'bg-rose-500/10 text-rose-500' },
  'Programming':        { icon: Code2,      bg: 'bg-amber-500/10 text-amber-500' },
  'Design':             { icon: Star,       bg: 'bg-purple-500/10 text-purple-500' },
  'Cloud':              { icon: Zap,        bg: 'bg-sky-500/10 text-sky-500' },
  'Security':           { icon: Lock,       bg: 'bg-rose-500/10 text-rose-500' },
};

const DIFF = {
  beginner:     { bg: 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/20', label: 'Beginner'                },
  intermediate: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', label: 'Intermediate to Advanced' },
  advanced:     { bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20', label: 'Advanced'                 },
};

export const Learning = () => {
  const { user } = useSelector((s) => s.auth);

  /* ── state ── */
  const [paths,         setPaths]         = useState([]);
  const [allProgress,   setAllProgress]   = useState([]);
  const [selectedPath,  setSelectedPath]  = useState(null);
  const [pathModules,   setPathModules]   = useState([]);
  const [pathProgress,  setPathProgress]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeTab,     setActiveTab]     = useState('all');
  const [search,        setSearch]        = useState('');
  const [category,      setCategory]      = useState('');
  const [level,         setLevel]         = useState('');
  const [sortBy,        setSortBy]        = useState('popular');
  const [expandedMod,   setExpandedMod]   = useState(0);
  const [detailTab,     setDetailTab]     = useState('roadmap');

  const [enrolling, setEnrolling] = useState(null);
  const [markingLesson, setMarkingLesson] = useState(null);
  const [bookmarked,    setBookmarked]    = useState({});

  /* ── load ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, pg] = await Promise.allSettled([fetchCoursesAPI(), fetchAllProgressAPI()]);
      const fetched = pr.status === 'fulfilled' ? (pr.value?.data?.paths || pr.value?.data || []) : [];
      
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

  const handleEnroll = async (pathId) => {
    setEnrolling(pathId);
    try {
      if (isEnrolled(pathId)) {
        await unenrollAPI(pathId);
        setAllProgress(prev => prev.filter(p => (p.learningPathId?._id || p.learningPathId) !== pathId));
        toast.success('Unenrolled from path');
      } else {
        await enrollAPI(pathId);
        const p = await fetchAllProgressAPI();
        setAllProgress(p?.data || []);
        toast.success('Enrolled in learning path! 🎉');
      }
    } catch { toast.error('Action failed. Please try again.'); }
    setEnrolling(null);
  };

  const handleBookmark = (pathId, e) => {
    e.stopPropagation();
    setBookmarked(b => {
      const next = { ...b, [pathId]: !b[pathId] };
      toast.success(next[pathId] ? 'Bookmarked!' : 'Bookmark removed');
      return next;
    });
  };

  /* ── derived ── */
  const getProg    = (id) => allProgress.find(p => (p.learningPathId?._id || p.learningPathId) === id);
  const getPct     = (id) => getProg(id)?.completionPercentage || 0;
  const isEnrolled = (id) => !!getProg(id);
  const isDone     = (id) => getProg(id)?.isCompleted || false;

  const categories = [...new Set(paths.map(p => p.category).filter(Boolean))];

  const filtered = paths.filter(p => {
    if (activeTab === 'enrolled')  return isEnrolled(p._id);
    if (activeTab === 'completed') return isDone(p._id);
    if (activeTab === 'my')        return isEnrolled(p._id);
    return (!search || p.title?.toLowerCase().includes(search.toLowerCase()))
        && (!category || p.category === category)
        && (!level    || p.difficulty === level);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') return (b.totalStudents || 0) - (a.totalStudents || 0);
    if (sortBy === 'rating')  return (b.rating || 0) - (a.rating || 0);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const enrolledCount = allProgress.length;
  const lessonsTotal  = allProgress.reduce((s,p) => s + (p.completedLessons?.length || 0), 0);
  const overallPct    = enrolledCount ? Math.round(allProgress.reduce((s,p) => s + (p.completionPercentage||0), 0) / enrolledCount) : 0;
  const streak        = user?.dayStreak ?? 0;

  /* ── Card Component ── */
  const PathCard = ({ path }) => {
    const pct    = getPct(path._id);
    const cfg    = CAT_ICONS[path.category] || { icon: BookOpen, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };
    const CatIcon = cfg.icon;
    const diff = DIFF[path.difficulty] || DIFF.beginner;
    const enrolled = isEnrolled(path._id);

    return (
      <div 
        onClick={() => openPath(path)} 
        className="w-full text-left rounded-3xl p-6 transition-all bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#04AA6D]/60 hover:shadow-xl dark:hover:border-[#04AA6D]/60 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] font-bold text-slate-400 font-mono mb-1 uppercase tracking-wider">{path.category || 'General'}</p>
            <h4 className="text-base font-black text-slate-900 dark:text-white font-mono group-hover:text-[#04AA6D] transition-colors leading-snug">
              {path.title}
            </h4>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
            <CatIcon className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4 font-sans">{path.description}</p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border ${diff.bg}`}>{diff.label}</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
            {path.modules?.length || 0} Modules
          </span>
          {enrolled && (
            <span className="text-[10px] font-mono font-bold text-[#04AA6D] bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              Enrolled ✓
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#04AA6D] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {(path.createdBy?.fullName || 'I')[0]}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{path.createdBy?.fullName || 'Instructor'}</span>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); openPath(path); }}
            className="px-4 py-2 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-mono font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Roadmap</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full text-slate-900 dark:text-slate-100 select-none pb-16 font-sans">

      {/* ── Page Header ── */}
      <div className="mb-4 text-left">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">Learning Paths & Courses</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Master computer science, software engineering, and system design through structured interactive roadmaps.</p>
      </div>

      {/* ── Featured DSA Learning Path Banner ── */}
      <div className="mb-6 p-6 rounded-3xl bg-slate-900 dark:bg-slate-900/90 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#04AA6D]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-left relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-[#04AA6D]/20 border border-[#04AA6D]/40 flex items-center justify-center text-2xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30 uppercase">FEATURED ROADMAP</span>
              <span className="text-xs text-slate-300 font-semibold">• 8 Topics & 100+ Problems</span>
            </div>
            <h2 className="text-lg font-black mt-1 text-white font-mono">DSA Learning Path & Interactive Compiler</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Master Data Structures & Algorithms topic-by-topic. Solve LeetCode-style problems with full real-time Python/JS/C++/Java execution and progressive hints.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.open('/dsa', '_blank')}
          className="px-6 py-3 bg-[#04AA6D] hover:bg-emerald-600 font-bold text-xs text-white rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-500/30 relative z-10"
        >
          <span>Explore DSA Roadmap ↗</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 mb-5 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          ['all', 'All Learning Paths'],
          ['my', 'My Learning'],
          ['enrolled', 'Enrolled'],
          ['completed', 'Completed']
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

      {/* ── Search + Filter Selectors ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }}
            placeholder="Search learning paths..."
            className="flex-1 text-xs bg-transparent outline-none text-slate-800 dark:text-slate-200 font-mono"
          />
        </div>

        <div className="relative flex items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[140px]">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }}
            className="w-full appearance-none bg-transparent outline-none text-xs font-mono text-slate-700 dark:text-slate-300 pr-6 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="relative flex items-center px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-w-[120px]">
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }}
            className="w-full appearance-none bg-transparent outline-none text-xs font-mono text-slate-700 dark:text-slate-300 pr-6 cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Main Catalog Grid & Stats Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start w-full">

        {/* ═══ Catalog Cards Grid ═══ */}
        <div className="flex-1 w-full text-left">
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Available Learning Tracks ({sorted.length})
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-24 gap-3 text-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#04AA6D] border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading catalog...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center py-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <BookOpen className="w-10 h-10 mb-3 text-slate-400" />
              <p className="text-xs font-mono text-slate-400">No learning paths found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {sorted.map((path) => <PathCard key={path._id} path={path} />)}
            </div>
          )}
        </div>

        {/* ═══ Learning Stats Sidebar ═══ */}
        <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-left">
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mb-3">Overall Learning Progress</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl border-2 border-[#04AA6D] flex items-center justify-center font-mono font-bold text-xs text-[#04AA6D] bg-[#04AA6D]/10">
                {overallPct}%
              </div>
              <div className="text-xs font-mono">
                <p className="font-bold text-slate-900 dark:text-white">{enrolledCount} Tracks Enrolled</p>
                <p className="text-[10px] text-slate-400">{lessonsTotal} Lessons Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs text-left">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-900 dark:text-white mb-2">
              <Flame size={16} className="text-amber-500" />
              <span>Learning Streak</span>
            </div>
            <p className="text-2xl font-black text-amber-500 font-mono">{streak} Days 🔥</p>
          </div>
        </div>

      </div>

    </div>
  );
};


export default Learning;
