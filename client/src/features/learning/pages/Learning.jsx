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
  const [detailTab,     setDetailTab]     = useState('modules');
  const [enrolling, setEnrolling] = useState(null);
  const [markingLesson, setMarkingLesson] = useState(null);
  const [bookmarked,    setBookmarked]    = useState({});

  /* ── load ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, pg] = await Promise.allSettled([fetchCoursesAPI(), fetchAllProgressAPI()]);
      if (pr.status === 'fulfilled') { const d = pr.value?.data; setPaths(d?.paths || d || []); }
      if (pg.status === 'fulfilled') setAllProgress(pg.value?.data || []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const openPath = async (path) => {
    setSelectedPath(path);
    setDetailLoading(true);
    setDetailTab('modules');
    setExpandedMod(0);
    try {
      const [dr, pr] = await Promise.allSettled([
        fetchCourseDetailsAPI(path._id),
        fetchPathProgressAPI(path._id),
      ]);
      if (dr.status === 'fulfilled') { const d = dr.value?.data; setPathModules(d?.modules || []); }
      if (pr.status === 'fulfilled') setPathProgress(pr.value?.data || null);
    } catch {}
    setDetailLoading(false);
  };

  const markComplete = async (lessonId, unmark = false) => {
    setMarkingLesson(lessonId);
    try {
      const res = await markLessonCompleteAPI(lessonId, unmark);
      if (res?.data) setPathProgress(res.data);
      const p = await fetchAllProgressAPI();
      setAllProgress(p?.data || []);
      toast.success(unmark ? 'Lesson marked incomplete' : 'Lesson completed! ✓');
    } catch { toast.error(unmark ? 'Could not unmark lesson' : 'Could not mark lesson'); }
    setMarkingLesson(null);
  };

  const handleEnroll = async () => {
    if (!selectedPath) return;
    const id = selectedPath._id;
    setEnrolling(id);
    try {
      if (pathEnrolled) {
        await unenrollAPI(id);
        setAllProgress(prev => prev.filter(p => (p.learningPathId?._id || p.learningPathId) !== id));
        setPathProgress(null);
        toast.success('Unenrolled from ' + selectedPath.title);
      } else {
        await enrollAPI(id);
        const [pr, dr] = await Promise.allSettled([
          fetchAllProgressAPI(),
          fetchPathProgressAPI(id),
        ]);
        if (pr.status === 'fulfilled') setAllProgress(pr.value?.data || []);
        if (dr.status === 'fulfilled') setPathProgress(dr.value?.data || null);
        toast.success('Enrolled in ' + selectedPath.title + '! 🎉');
      }
    } catch { toast.error('Action failed. Please try again.'); }
    setEnrolling(null);
  };

  const handleStartLearning = () => {
    if (!selectedPath) return;
    if (!pathEnrolled) { handleEnroll(); return; }
    for (let mi = 0; mi < pathModules.length; mi++) {
      const mod = pathModules[mi];
      const hasIncomplete = (mod.lessons || []).some(l => !lessonDone(l._id || l));
      if (hasIncomplete) { setExpandedMod(mi); break; }
    }
    toast.success('Resuming where you left off!');
  };

  const handleBookmark = (pathId) => {
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
  const lessonDone = (lid) => pathProgress?.completedLessons?.some(l => (l._id || l) === lid);

  const completedCount   = pathProgress?.completedLessons?.length || 0;
  const totalInPath      = pathModules.reduce((s, m) => s + (m.lessons?.length || 0), 0);
  const pathPct          = selectedPath ? getPct(selectedPath._id) : 0;
  const pathEnrolled     = selectedPath ? isEnrolled(selectedPath._id) : false;

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
  const timeH         = Math.round(lessonsTotal * 18 / 60);
  const overallPct    = enrolledCount ? Math.round(allProgress.reduce((s,p) => s + (p.completionPercentage||0), 0) / enrolledCount) : 0;
  const inProgPaths   = allProgress.filter(p => !p.isCompleted && (p.completionPercentage||0) > 0).slice(0,3);
  const streak        = user?.dayStreak ?? 0;

  /* ── Card Component ── */
  const PathCard = ({ path }) => {
    const pct    = getPct(path._id);
    const active = selectedPath?._id === path._id;
    const cfg    = CAT_ICONS[path.category] || { icon: BookOpen, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500' };
    const CatIcon = cfg.icon;
    const diff = DIFF[path.difficulty] || DIFF.beginner;
    return (
      <button 
        onClick={() => openPath(path)} 
        className={`w-full text-left rounded-2xl p-4 transition-all bg-white dark:bg-slate-900 border ${
          active 
            ? 'border-[#04AA6D] ring-2 ring-[#04AA6D]/20 shadow-md' 
            : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[10px] font-bold text-slate-400 font-mono mb-1 uppercase tracking-wider">{path.category}</p>
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">{path.title}</h4>
          </div>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
            <CatIcon className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">{path.description}</p>

        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${diff.bg}`}>{diff.label}</span>
          <span className="text-[10px] font-mono text-slate-400">{path.modules?.length || 0} Modules</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#04AA6D] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {(path.createdBy?.fullName || 'I')[0]}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{path.createdBy?.fullName || 'Instructor'}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-[10px] font-mono font-bold">
            <span className="text-slate-400">Progress</span>
            <span className="text-[#04AA6D]">{pct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-1.5 rounded-full bg-[#04AA6D] transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full text-slate-900 dark:text-slate-100 select-none pb-16 font-sans">

      {/* ── Page Header ── */}
      <div className="mb-4 text-left">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">Learning Paths & Courses</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Master computer science, software engineering, and system design through structured paths.</p>
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
          onClick={() => window.location.href = '/dsa'}
          className="px-6 py-3 bg-[#04AA6D] hover:bg-emerald-600 font-bold text-xs text-white rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-500/30 relative z-10"
        >
          <span>Explore DSA Roadmap</span>
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

      {/* ── 3-column Layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 items-start">

        {/* ═══ LEFT PANEL: Path List ═══ */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Available Paths</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg outline-none cursor-pointer"
            >
              <option value="popular">Popular</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-[#04AA6D] border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading paths...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-8 h-8 mb-2 text-slate-400" />
              <p className="text-xs font-mono text-slate-400">No paths found</p>
            </div>
          ) : (
            sorted.map((path) => <PathCard key={path._id} path={path} />)
          )}
        </div>

        {/* ═══ CENTER PANEL: Detail View ═══ */}
        <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs flex flex-col min-h-[500px]">
          {!selectedPath ? (
            <div className="flex flex-col items-center justify-center py-36 text-center">
              <BookOpen className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
              <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Select a learning path to inspect details</p>
            </div>
          ) : (
            <>
              {/* Header Breadcrumb */}
              <div className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <button onClick={() => setSelectedPath(null)} className="text-[#04AA6D] hover:underline font-bold">All Paths</button>
                  <ChevronRight size={12} className="text-slate-400" />
                  <span className="font-bold text-slate-900 dark:text-white truncate">{selectedPath.title}</span>
                </div>
              </div>

              {/* Main Course Info */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 text-left">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{selectedPath.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{selectedPath.description}</p>
                    
                    {/* Course Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                      {[
                        { label: 'Level',    val: DIFF[selectedPath.difficulty]?.label || 'Beginner' },
                        { label: 'Modules',  val: selectedPath.modules?.length || 0 },
                        { label: 'Duration', val: fmtMins(selectedPath.duration) },
                        { label: 'Enrolled', val: (selectedPath.totalStudents>=1000 ? ((selectedPath.totalStudents/1000).toFixed(1)+'K') : (selectedPath.totalStudents||0)) + ' Students' },
                      ].map((s) => (
                        <div key={s.label} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                          <p className="text-[9px] font-mono uppercase font-bold text-slate-400">{s.label}</p>
                          <p className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5">{s.val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleStartLearning}
                        disabled={enrolling === selectedPath._id}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold font-mono text-white bg-[#04AA6D] hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                      >
                        {enrolling === selectedPath._id ? 'Loading…' : pathPct > 0 ? 'Continue Learning' : 'Start Learning'}
                      </button>

                      <button
                        onClick={handleEnroll}
                        disabled={enrolling === selectedPath._id}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
                          pathEnrolled 
                            ? 'bg-emerald-500/10 text-[#04AA6D] border-emerald-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {pathEnrolled && <CheckCircle2 size={14} />}
                        {pathEnrolled ? 'Enrolled' : 'Enroll in Path'}
                      </button>

                      <button
                        onClick={() => handleBookmark(selectedPath._id)}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#04AA6D] border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        {bookmarked[selectedPath._id] ? <BookmarkCheck size={16} className="text-[#04AA6D]" /> : <Bookmark size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar if enrolled */}
                {pathEnrolled && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Course Progress</span>
                      <span className="text-[#04AA6D] font-bold">{pathPct}% Complete</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-2 rounded-full bg-[#04AA6D] transition-all" style={{ width: `${pathPct}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Course Detail Tabs */}
              <div className="flex items-center px-6 border-b border-slate-100 dark:border-slate-800 gap-2 font-mono text-xs">
                {[
                  ['modules', 'Modules'],
                  ['about', 'About'],
                  ['resources', 'Resources'],
                  ['reviews', 'Reviews'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setDetailTab(id)}
                    className={`px-4 py-3 font-bold transition-all cursor-pointer border-b-2 ${
                      detailTab === id
                        ? 'border-[#04AA6D] text-[#04AA6D]'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Panel Content */}
              <div className="p-6 text-left overflow-y-auto max-h-[400px]">
                {detailTab === 'modules' && (
                  <div className="space-y-3">
                    {detailLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-6 h-6 rounded-full border-2 border-[#04AA6D] border-t-transparent animate-spin" />
                      </div>
                    ) : pathModules.length === 0 ? (
                      <p className="text-xs font-mono text-slate-400 text-center py-8">No modules published yet.</p>
                    ) : pathModules.map((mod, mi) => {
                      const lessons = mod.lessons || [];
                      const doneCount = lessons.filter(l => lessonDone(l._id || l)).length;
                      const isOpen = expandedMod === mi;
                      return (
                        <div key={mod._id || mi} className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                          <button
                            onClick={() => setExpandedMod(isOpen ? null : mi)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950/60 text-left font-mono text-xs font-bold cursor-pointer"
                          >
                            <span className="text-slate-900 dark:text-white">{mod.title}</span>
                            <span className="text-[10px] text-slate-400">{doneCount} / {lessons.length} completed</span>
                          </button>

                          {isOpen && (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                              {lessons.map((lesson, li) => {
                                const done = lessonDone(lesson._id || lesson);
                                const LIcon = lesson.type === 'video' ? Play : lesson.type === 'code' ? Code2 : FileText;
                                return (
                                  <div key={lesson._id || li} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 text-xs">
                                    <div className="flex items-center gap-2.5">
                                      <LIcon size={14} className={done ? 'text-[#04AA6D]' : 'text-slate-400'} />
                                      <span className={done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}>{lesson.title}</span>
                                    </div>

                                    <button
                                      onClick={() => markComplete(lesson._id || lesson, done)}
                                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                                        done ? 'bg-emerald-500/10 text-[#04AA6D]' : 'bg-[#04AA6D] text-white hover:bg-emerald-600'
                                      }`}
                                    >
                                      {done ? 'Completed ✓' : 'Mark Complete'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {detailTab === 'about' && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{selectedPath.description}</p>
                )}
              </div>

            </>
          )}
        </div>

        {/* ═══ RIGHT PANEL: Learning Stats Sidebar ═══ */}
        <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs text-left">
            <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mb-3">Overall Learning Progress</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-[#04AA6D] flex items-center justify-center font-mono font-bold text-xs text-[#04AA6D]">
                {overallPct}%
              </div>
              <div className="text-xs font-mono">
                <p className="font-bold text-slate-900 dark:text-white">{enrolledCount} Paths</p>
                <p className="text-[10px] text-slate-400">{lessonsTotal} Lessons Done</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs text-left">
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
