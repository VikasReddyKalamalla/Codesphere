import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Search, ChevronDown, List, LayoutGrid,
  BookOpen, Play, FileText, Code2,
  CheckCircle2, Lock, ChevronRight, ChevronUp,
  Bookmark, BookmarkCheck, Flame, Star,
  Users, Clock, BarChart2, Zap, XCircle
} from 'lucide-react';import toast from 'react-hot-toast';
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
  'Web Development':    { icon: Zap,       bg: '#fff7ed', color: '#ea580c' },
  'Data Science':       { icon: BarChart2,  bg: '#fdf4ff', color: '#9333ea' },
  'Mobile Development': { icon: BookOpen,   bg: '#eff6ff', color: '#2563eb' },
  'DevOps':             { icon: Code2,      bg: '#f0fdf4', color: '#16a34a' },
  'System Design':      { icon: BarChart2,  bg: '#fef2f2', color: '#dc2626' },
  'Programming':        { icon: Code2,      bg: '#fffbeb', color: '#d97706' },
  'Design':             { icon: Star,       bg: '#fdf4ff', color: '#a855f7' },
  'Cloud':              { icon: Zap,        bg: '#eff6ff', color: '#0ea5e9' },
  'Security':           { icon: Lock,       bg: '#fef2f2', color: '#ef4444' },
};

const DIFF = {
  beginner:     { bg: '#dcfce7', color: '#15803d', label: 'Beginner'                },
  intermediate: { bg: '#fef9c3', color: '#854d0e', label: 'Intermediate to Advanced' },
  advanced:     { bg: '#fee2e2', color: '#991b1b', label: 'Advanced'                 },
};

const ACH = [
  { emoji: '🏆', title: 'Lesson Master',      desc: 'Complete 25 lessons',         date: 'May 12, 2025' },
  { emoji: '🔥', title: 'Consistent Learner', desc: 'Learn for 7 days in a row',   date: 'May 8, 2025'  },
  { emoji: '💡', title: 'Code Explorer',       desc: 'Complete 5 coding exercises', date: 'May 5, 2025'  },
];

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
    // Expand the first module that has an incomplete lesson
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

  // sidebar stats
  const enrolledCount = allProgress.length;
  const lessonsTotal  = allProgress.reduce((s,p) => s + (p.completedLessons?.length || 0), 0);
  const timeH         = Math.round(lessonsTotal * 18 / 60);
  const overallPct    = enrolledCount ? Math.round(allProgress.reduce((s,p) => s + (p.completionPercentage||0), 0) / enrolledCount) : 0;
  const inProgPaths   = allProgress.filter(p => !p.isCompleted && (p.completionPercentage||0) > 0).slice(0,3);
  const streak        = user?.dayStreak ?? 0;

  /* ── card ── */
  const PathCard = ({ path }) => {
    const pct    = getPct(path._id);
    const active = selectedPath?._id === path._id;
    const cfg    = CAT_ICONS[path.category] || { icon: BookOpen, bg: '#f3f4f6', color: '#6b7280' };
    const CatIcon = cfg.icon;
    const diff = DIFF[path.difficulty] || DIFF.beginner;
    return (
      <button onClick={() => openPath(path)} className="w-full text-left rounded-2xl p-4 transition-all"
        style={{ background: '#fff', border: active ? '2px solid #04AA6D' : '1px solid rgba(0,0,0,0.08)', boxShadow: active ? '0 0 0 3px rgba(4,170,109,0.1)' : 'none' }}>
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[10px] font-semibold mb-1" style={{ color: '#888' }}>{path.category}</p>
            <h4 className="text-sm font-bold leading-snug" style={{ color: '#111' }}>{path.title}</h4>
          </div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
            <CatIcon className="w-4 h-4" style={{ color: cfg.color }} />
          </div>
        </div>
        <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: '#888' }}>{path.description}</p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: diff.bg, color: diff.color }}>{diff.label}</span>
          <span className="text-[10px]" style={{ color: '#aaa' }}>{path.modules?.length || 0} Modules</span>
        </div>
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#04AA6D] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {(path.createdBy?.fullName || 'I')[0]}
          </div>
          <span className="text-xs" style={{ color: '#555' }}>{path.createdBy?.fullName || 'Instructor'}</span>
        </div>
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px]" style={{ color: '#aaa' }}>Progress</span>
            <span className="text-[10px] font-bold" style={{ color: '#04AA6D' }}>{pct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: '#04AA6D' }} />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col w-full" style={{ color: '#111', minHeight: '100vh' }}>

      {/* ── Page title ── */}
      <div className="mb-3">
        <h1 className="text-xl font-bold" style={{ color: '#111' }}>Learning Paths</h1>
        <p className="text-sm mt-0.5" style={{ color: '#888' }}>Learn, practice and build real-world skills with structured paths.</p>
      </div>

      {/* ── Featured DSA Learning Path Banner ── */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-zinc-950 via-indigo-950 to-purple-950 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl shrink-0">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase">FEATURED ROADMAP</span>
              <span className="text-xs text-indigo-300 font-semibold">• 8 Topics & 100+ Problems</span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">DSA Learning Path & Interactive Compiler</h2>
            <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">
              Master Data Structures & Algorithms topic-by-topic. Solve LeetCode-style problems with full real-time Python/JS/C++/Java execution, progressive hints, and sequential level unlocks.
            </p>
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/dsa'}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer"
        >
          Explore DSA Roadmap →
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 mb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.09)' }}>
        {[['all','All Paths'],['my','My Learning'],['enrolled','Enrolled'],['completed','Completed']].map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ color: activeTab===id ? '#04AA6D' : '#888', borderBottom: activeTab===id ? '2px solid #04AA6D' : '2px solid transparent', marginBottom: -1, background: 'transparent' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: '#bbb' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }}
            placeholder="Search learning paths..." className="flex-1 text-sm bg-transparent outline-none" style={{ color: '#111' }} />
        </div>
        {/* Category dropdown */}
        <div className="relative flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', minWidth: 140 }}>
          <select value={category} onChange={e => { setCategory(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }} className="w-full appearance-none bg-transparent outline-none text-sm pr-6 cursor-pointer" style={{ color: '#444' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: '#aaa' }} />
        </div>
        {/* Level dropdown */}
        <div className="relative flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', minWidth: 120 }}>
          <select value={level} onChange={e => { setLevel(e.target.value); if (activeTab !== 'all') setActiveTab('all'); }} className="w-full appearance-none bg-transparent outline-none text-sm pr-6 cursor-pointer" style={{ color: '#444' }}>
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: '#aaa' }} />
        </div>
        {/* Instructors dropdown */}
        <div className="relative flex items-center px-3.5 py-2.5 rounded-xl cursor-pointer" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', minWidth: 140 }}>
          <select className="w-full appearance-none bg-transparent outline-none text-sm pr-6 cursor-pointer" style={{ color: '#444' }}>
            <option>All Instructors</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 pointer-events-none" style={{ color: '#aaa' }} />
        </div>
      </div>

      {/* ── 3-column layout ── */}
      <div className="flex gap-4 flex-1 min-h-0" style={{ alignItems: 'flex-start' }}>

        {/* ═══ LEFT — path list ═══ */}
        <div className="flex flex-col gap-3 shrink-0" style={{ width: 280 }}>
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#888' }}>All Learning Paths</span>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none text-xs pl-2 pr-6 py-1 rounded-lg outline-none cursor-pointer" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)', color: '#555' }}>
                  <option value="popular">Sort by: Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none" style={{ color: '#aaa' }} />
              </div>
              <button className="p-1.5 rounded-lg" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.1)' }}>
                <List className="w-3.5 h-3.5" style={{ color: '#666' }} />
              </button>
            </div>
          </div>

          {/* Path cards */}
          {loading ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-7 h-7 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(0,0,0,0.08)', borderTopColor: '#2563eb' }} />
              <p className="text-xs" style={{ color: '#bbb' }}>Loading paths...</p>
            </div>
          ) : sorted.length === 0 ? (
            <div className="flex flex-col items-center py-12 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)' }}>
              <BookOpen className="w-8 h-8 mb-2" style={{ color: '#ddd' }} />
              <p className="text-xs" style={{ color: '#aaa' }}>No paths found</p>
            </div>
          ) : (
            sorted.map(path => <PathCard key={path._id} path={path} />)
          )}
        </div>

        {/* ═══ CENTER — detail panel ═══ */}
        <div className="flex-1 min-w-0 flex flex-col gap-0 rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
          {!selectedPath ? (
            <div className="flex flex-col items-center justify-center py-32">
              <BookOpen className="w-12 h-12 mb-4" style={{ color: '#e5e7eb' }} />
              <p className="text-sm font-semibold" style={{ color: '#aaa' }}>Select a path to view details</p>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 px-6 pt-5 pb-1" style={{ borderBottom: 'none' }}>
                <button onClick={() => setSelectedPath(null)} className="text-xs text-blue-600 hover:underline">All Paths</button>
                <ChevronRight className="w-3 h-3" style={{ color: '#bbb' }} />
                <span className="text-xs font-semibold" style={{ color: '#111' }}>{selectedPath.title}</span>
              </div>

              {/* Hero */}
              <div className="px-6 pt-3 pb-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold mb-2" style={{ color: '#111' }}>{selectedPath.title}</h2>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: '#666' }}>{selectedPath.description}</p>
                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-5">
                      {[
                        { label: 'Level',    val: DIFF[selectedPath.difficulty]?.label || 'Beginner' },
                        { label: 'Modules',  val: selectedPath.modules?.length || 0 },
                        { label: 'Duration', val: fmtMins(selectedPath.duration) },
                        { label: 'Enrolled', val: (selectedPath.totalStudents>=1000 ? ((selectedPath.totalStudents/1000).toFixed(1)+'K') : (selectedPath.totalStudents||0)) + ' Students' },
                      ].map(s => (
                        <div key={s.label}>
                          <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#aaa' }}>{s.label}</p>
                          <p className="text-sm font-bold leading-tight" style={{ color: '#111' }}>{s.val}</p>
                        </div>
                      ))}
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleStartLearning}
                        disabled={enrolling === selectedPath._id}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-md shadow-emerald-500/20"
                        style={{ background: '#04AA6D', opacity: enrolling === selectedPath._id ? 0.7 : 1 }}>
                        {enrolling === selectedPath._id ? 'Loading…' : pathPct > 0 ? 'Continue Learning' : 'Start Learning'}
                      </button>
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling === selectedPath._id}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: pathEnrolled ? '#f0fdf4' : '#F5F4F0', color: pathEnrolled ? '#16a34a' : '#555', border: '1px solid rgba(0,0,0,0.1)', opacity: enrolling === selectedPath._id ? 0.7 : 1 }}>
                        {pathEnrolled && <CheckCircle2 className="w-4 h-4" />}
                        {pathEnrolled ? 'Enrolled' : 'Enroll'}
                      </button>
                      <button
                        onClick={() => handleBookmark(selectedPath._id)}
                        className="p-2.5 rounded-xl transition-all"
                        style={{ background: '#F5F4F0', border: '1px solid rgba(0,0,0,0.08)' }}>
                        {bookmarked[selectedPath._id]
                          ? <BookmarkCheck className="w-4 h-4" style={{ color: '#04AA6D' }} />
                          : <Bookmark className="w-4 h-4" style={{ color: '#888' }} />}
                      </button>
                    </div>
                  </div>
                  {/* Category icon */}
                  {(() => {
                    const cfg = CAT_ICONS[selectedPath.category] || { icon: BookOpen, bg: '#f3f4f6', color: '#6b7280' };
                    const CatIcon = cfg.icon;
                    return (
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                        <CatIcon className="w-8 h-8" style={{ color: cfg.color }} />
                      </div>
                    );
                  })()}
                </div>

                {/* Overall progress bar — only when enrolled */}
                {pathEnrolled && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: '#555' }}>Overall Progress</span>
                      <span className="text-xs" style={{ color: '#888' }}>Time Spent: {fmtMins(completedCount * 18)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full mb-1" style={{ background: '#e5e7eb' }}>
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pathPct}%`, background: '#2563eb' }} />
                    </div>
                    <p className="text-[11px]" style={{ color: '#aaa' }}>Completed: {completedCount} / {totalInPath} lessons</p>
                  </div>
                )}
              </div>

              {/* Detail tabs */}
              <div className="flex items-center px-6 gap-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                {[
                  ['modules', 'Modules'],
                  ['about',   'About'],
                  ['resources','Resources'],
                  ['reviews',  `Reviews (${Math.max(1, Math.floor((selectedPath.totalStudents||0)*0.015))})`],
                ].map(([id, label]) => (
                  <button key={id} onClick={() => setDetailTab(id)}
                    className="px-4 py-3 text-sm font-semibold transition-colors"
                    style={{ color: detailTab===id ? '#2563eb' : '#888', borderBottom: detailTab===id ? '2px solid #2563eb' : '2px solid transparent', marginBottom: -1 }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 480px)', minHeight: 300 }}>
                {detailTab === 'modules' && (
                  <div className="px-6 py-4 flex flex-col gap-2">
                    {detailLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="w-6 h-6 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(0,0,0,0.08)', borderTopColor: '#2563eb', borderWidth: 3 }} />
                      </div>
                    ) : pathModules.length === 0 ? (
                      <p className="text-sm text-center py-8" style={{ color: '#aaa' }}>No modules yet.</p>
                    ) : pathModules.map((mod, mi) => {
                      const lessons    = mod.lessons || [];
                      const doneCount  = lessons.filter(l => lessonDone(l._id || l)).length;
                      const allDone    = doneCount === lessons.length && lessons.length > 0;
                      const isOpen     = expandedMod === mi;
                      return (
                        <div key={mod._id || mi} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.09)' }}>
                          {/* Module header */}
                          <button onClick={() => setExpandedMod(isOpen ? null : mi)}
                            className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                            style={{ background: isOpen ? '#eff6ff' : '#F9F9F7' }}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              {allDone
                                ? <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#04AA6D' }} />
                                : <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: '#2563eb' }}>
                                    {isOpen && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                  </div>
                              }
                              <span className="text-xs font-bold truncate" style={{ color: '#111' }}>{mod.title}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[10px]" style={{ color: '#888' }}>{doneCount} / {lessons.length} lessons completed</span>
                              {allDone && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#04AA6D' }} />}
                              {isOpen ? <ChevronUp className="w-4 h-4" style={{ color: '#888' }} /> : <ChevronDown className="w-4 h-4" style={{ color: '#888' }} />}
                            </div>
                          </button>
                          {/* Lessons list */}
                          {isOpen && (
                            <div className="flex flex-col" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                              {lessons.map((lesson, li) => {
                                const done    = lessonDone(lesson._id || lesson);
                                const locked  = !pathEnrolled && !lesson.isFree;
                                const LIcon   = lesson.type === 'video' ? Play : lesson.type === 'code' ? Code2 : FileText;
                                const marking = markingLesson === (lesson._id || lesson);
                                return (
                                  <div key={lesson._id || li}
                                    className="flex items-center gap-3 px-4 py-2.5"
                                    style={{ background: '#fff', borderBottom: li < lessons.length-1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                    <span className="text-xs w-4 text-right shrink-0" style={{ color: '#bbb' }}>{li+1}</span>
                                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: done ? '#dcfce7' : '#F5F4F0' }}>
                                      <LIcon className="w-3 h-3" style={{ color: done ? '#04AA6D' : '#888' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate" style={{ color: locked ? '#ccc' : '#111' }}>{lesson.title}</p>
                                      <p className="text-[10px] mt-0.5" style={{ color: '#bbb' }}>
                                        {lesson.type === 'video' ? 'Video' : lesson.type === 'code' ? 'Code Exercise' : 'Article'} · {lesson.duration || 0} min
                                      </p>
                                    </div>
                                    {locked ? (
                                      <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: '#ddd' }} />
                                    ) : done ? (
                                      <button
                                        onClick={() => markComplete(lesson._id || lesson, true)}
                                        disabled={marking}
                                        className="p-1 rounded-full text-[#04AA6D] hover:text-rose-500 hover:bg-rose-50 transition-all shrink-0 cursor-pointer flex items-center justify-center group"
                                        title="Unmark Complete"
                                      >
                                        <CheckCircle2 className="w-4 h-4 block group-hover:hidden" />
                                        <XCircle className="w-4 h-4 hidden group-hover:block" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => markComplete(lesson._id || lesson)}
                                        disabled={marking}
                                        className="px-3 py-1 rounded-lg text-[10px] font-bold text-white shrink-0 transition-opacity"
                                        style={{ background: '#2563eb', opacity: marking ? 0.6 : 1 }}>
                                        {marking ? '…' : 'Mark Complete'}
                                      </button>
                                    )}
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
                  <div className="px-6 py-5">
                    <p className="text-sm leading-relaxed mb-5" style={{ color: '#555' }}>{selectedPath.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[['Difficulty', DIFF[selectedPath.difficulty]?.label || '—'], ['Duration', fmtMins(selectedPath.duration)], ['Students', (selectedPath.totalStudents||0).toLocaleString()], ['Rating', `${selectedPath.rating || 0} / 5 ★`]].map(([k,v]) => (
                        <div key={k} className="p-3.5 rounded-xl" style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#aaa' }}>{k}</p>
                          <p className="text-sm font-bold" style={{ color: '#111' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailTab === 'resources' && (
                  <div className="px-6 py-5 flex flex-col gap-2">
                    {['Course slides (PDF)', 'Starter code repository (GitHub)', 'Recommended reading list', 'Community Discord server'].map((r,i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-colors" style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.07)' }}
                        onMouseEnter={e => e.currentTarget.style.background='#eff6ff'}
                        onMouseLeave={e => e.currentTarget.style.background='#F9F9F7'}>
                        <FileText className="w-4 h-4 shrink-0" style={{ color: '#2563eb' }} />
                        <span className="text-xs font-medium" style={{ color: '#333' }}>{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {detailTab === 'reviews' && (
                  <div className="px-6 py-5 flex flex-col gap-3">
                    {[['Sarah Chen', 'Great course! Very comprehensive and well-structured. The projects are practical.', 5], ['Alex Thompson', 'Loved the hands-on exercises. Highly recommend to anyone starting out.', 5], ['Priya Nair', 'Good content, could use more advanced deep-dive topics.', 4]].map(([name, review, stars], i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.07)' }}>
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-600 shrink-0">{name[0]}</div>
                          <div>
                            <p className="text-xs font-bold" style={{ color: '#111' }}>{name}</p>
                            <div className="flex gap-0.5 mt-0.5">{[...Array(stars)].map((_,j) => <Star key={j} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}</div>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#666' }}>{review}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ═══ RIGHT — sidebar ═══ */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 240 }}>

          {/* My Learning Progress */}
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#111' }}>My Learning Progress</p>
            {/* Ring */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="24" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                  <circle cx="32" cy="32" r="24" fill="none" stroke="#2563eb" strokeWidth="5"
                    strokeDasharray={`${2*Math.PI*24}`}
                    strokeDashoffset={`${2*Math.PI*24*(1-overallPct/100)}`}
                    strokeLinecap="round" transform="rotate(-90 32 32)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black" style={{ color: '#111' }}>{overallPct}%</span>
                  <span className="text-[8px]" style={{ color: '#aaa' }}>Progress</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                {[['Total Paths Enrolled', enrolledCount], ['Lessons Completed', lessonsTotal], ['Time Spent', `${timeH}h`]].map(([l,v]) => (
                  <div key={l}>
                    <p className="text-[10px]" style={{ color: '#aaa' }}>{l}</p>
                    <p className="text-sm font-bold" style={{ color: '#111' }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setActiveTab('my')} className="w-full py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{ background: '#F5F4F0', border: '1px solid rgba(0,0,0,0.08)', color: '#555' }}>
              View My Learning
            </button>
          </div>

          {/* In Progress */}
          {/* In Progress */}
          {inProgPaths.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold" style={{ color: '#111' }}>In Progress</p>
              </div>
              <div className="flex flex-col gap-3">
                {inProgPaths.map((p, i) => {
                  const name = p.learningPathId?.title || 'Learning Path';
                  const pct  = p.completionPercentage || 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate mr-2" style={{ color: '#333' }}>{name}</span>
                        <span className="text-xs font-bold shrink-0" style={{ color: '#2563eb' }}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: '#2563eb' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setActiveTab('enrolled')} className="mt-3 text-xs font-semibold text-blue-600 hover:underline block">View All</button>
            </div>
          )}

          {/* Recent Achievements */}
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold" style={{ color: '#111' }}>Recent Achievements</p>
              <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {(() => {
                const userPoints = user?.achievementPoints ?? 0;
                const userBadges = [];
                if (userPoints >= 100)  userBadges.push({ emoji: '⭐', title: 'Rising Star',      desc: 'Earned 100 XP points',         date: 'Unlocked' });
                if (userPoints >= 500)  userBadges.push({ emoji: '🔥', title: 'Consistent Learner', desc: 'Earned 500 XP points',         date: 'Unlocked' });
                if (userPoints >= 1000) userBadges.push({ emoji: '🏆', title: 'Expert Learner',     desc: 'Earned 1000 XP points',        date: 'Unlocked' });

                if (userBadges.length > 0) {
                  return userBadges.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0" style={{ background: '#F5F4F0' }}>
                        {a.emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold" style={{ color: '#111' }}>{a.title}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#aaa' }}>{a.desc}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: '#bbb' }}>{a.date}</p>
                      </div>
                    </div>
                  ));
                } else {
                  return (
                    <p className="text-[11px] text-slate-400 font-semibold py-2">No achievements earned yet. Start learning to unlock!</p>
                  );
                }
              })()}
            </div>
          </div>

          {/* Learn Streak */}
          <div className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-xs font-bold mb-3" style={{ color: '#111' }}>Learn Streak</p>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5" style={{ color: '#f97316' }} />
              <span className="text-xl font-black" style={{ color: '#111' }}>{streak}</span>
              <span className="text-xs" style={{ color: '#888' }}>Days in a row</span>
            </div>
            <div className="flex items-center justify-between">
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold" style={{ color: '#aaa' }}>{d}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: i < streak ? '#dcfce7' : '#F5F4F0', border: `1px solid ${i < streak ? '#04AA6D33' : 'rgba(0,0,0,0.07)'}` }}>
                    {i < streak && <CheckCircle2 className="w-3 h-3" style={{ color: '#04AA6D' }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Learning;
