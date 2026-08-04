import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Flame, BookOpen, Lock, ChevronRight,
  TrendingUp, Search, Award, BarChart3, Clock,
  CheckCircle2, Sparkles, Play, ShieldCheck, Zap, Star
} from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/15 text-red-400 border-red-500/30',
    beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    intermediate: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    advanced: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${colors[difficulty] || colors.easy}`}>
      {difficulty}
    </span>
  );
};

const getRankTitle = (solved) => {
  if (solved >= 300) return { title: 'Grandmaster Alchemist', badge: '👑', color: '#04AA6D' };
  if (solved >= 150) return { title: 'Tree & Graph Titan', badge: '⚔️', color: '#10b981' };
  if (solved >= 50)  return { title: 'Array Specialist', badge: '🛡️', color: '#059669' };
  if (solved >= 10)  return { title: 'Code Explorer', badge: '⚡', color: '#34d399' };
  return { title: 'Novice Coder', badge: '🌱', color: '#6ee7b7' };
};

const GitHubStreakCard = () => {
  const [ghUser, setGhUser] = useState(localStorage.getItem('codesphere_github_user') || '');
  const [inputUser, setInputUser] = useState(ghUser);
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ghUser) {
      fetchStreak(ghUser);
    } else {
      setStreakData(null);
    }
  }, [ghUser]);

  const fetchStreak = async (user) => {
    try {
      setLoading(true);
      const res = await dsaAPI.getGitHubStreak(user);
      if (res.data?.connected) {
        setStreakData(res.data);
        localStorage.setItem('codesphere_github_user', user);
      } else {
        setStreakData(null);
      }
    } catch (err) {
      toast.error('GitHub user not found or has private profile');
      setStreakData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (e) => {
    e.preventDefault();
    if (inputUser.trim()) {
      setGhUser(inputUser.trim());
    }
  };

  const handleDisconnect = () => {
    setGhUser('');
    setInputUser('');
    setStreakData(null);
    localStorage.removeItem('codesphere_github_user');
    toast('GitHub handle disconnected');
  };

  return (
    <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800/80 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0 font-bold">
            🐙
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">GitHub Contribution Streak</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                streakData?.connected
                  ? 'bg-[#04AA6D]/20 text-[#04AA6D] border-[#04AA6D]/30'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {streakData?.connected ? 'LIVE SYNCED' : 'NOT CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">Track your daily open-source commits alongside your DSA problem streak.</p>
          </div>
        </div>

        {streakData?.connected ? (
          <button
            onClick={handleDisconnect}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs rounded-xl border border-zinc-800 transition-colors shrink-0 cursor-pointer"
          >
            Disconnect Handle
          </button>
        ) : (
          <form onSubmit={handleConnect} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
              placeholder="Enter GitHub username..."
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#04AA6D] transition-colors w-full sm:w-48 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#04AA6D] hover:bg-[#038d5a] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer border border-emerald-400/30"
            >
              {loading ? 'Syncing...' : 'Connect Handle'}
            </button>
          </form>
        )}
      </div>

      {streakData?.connected ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* User Badge Info */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
            <img
              src={streakData.avatarUrl}
              alt={streakData.username}
              className="w-11 h-11 rounded-2xl border border-zinc-700 object-cover shrink-0"
              onError={(e) => { e.target.src = 'https://github.com/github.png'; }}
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">@{streakData.username}</h4>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono mt-0.5">
                <span>📁 {streakData.publicRepos} Repos</span>
                <span>👥 {streakData.followers} Followers</span>
              </div>
            </div>
          </div>

          {/* GitHub Streak Stats */}
          <div className="flex items-center justify-around p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="text-center">
              <div className="text-[11px] text-zinc-400 font-semibold mb-0.5">🔥 GitHub Streak</div>
              <div className="text-lg font-black text-emerald-400">{streakData.currentStreak} <span className="text-xs font-normal text-zinc-500">days</span></div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-[11px] text-zinc-400 font-semibold mb-0.5">⚡ Longest Streak</div>
              <div className="text-lg font-black text-amber-400">{streakData.longestStreak} <span className="text-xs font-normal text-zinc-500">days</span></div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-center">
              <div className="text-[11px] text-zinc-400 font-semibold mb-0.5">🟢 Contributions</div>
              <div className="text-lg font-black text-white">{streakData.totalContributions}</div>
            </div>
          </div>

          {/* 28-day Activity Grid Visualizer */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="text-[11px] text-zinc-400 font-semibold mb-2 flex items-center justify-between">
              <span>Recent Commit Activity</span>
              <span className="text-[10px] text-emerald-400 font-mono">Real-time</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {streakData.contributionGrid?.map((item, idx) => {
                const colors = [
                  'bg-zinc-800/60',
                  'bg-emerald-900/40 border border-emerald-800/50',
                  'bg-emerald-700/60 border border-emerald-600/60',
                  'bg-emerald-500 border border-emerald-400',
                  'bg-[#04AA6D] border border-emerald-300 shadow-sm shadow-[#04AA6D]/40',
                ];
                return (
                  <div
                    key={idx}
                    title={`${item.date}: ${item.count} commits`}
                    className={`h-4 rounded-md transition-all hover:scale-110 ${colors[item.level] || colors[0]}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-center space-y-2">
          <p className="text-xs text-zinc-400">
            💡 No GitHub account linked yet. Enter your GitHub handle above to sync real-time commit activity & streaks.
          </p>
        </div>
      )}
    </div>
  );
};

export default function DSARoadmapPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [topicsRes, dashRes] = await Promise.all([
        dsaAPI.getTopics(),
        dsaAPI.getDashboard(),
      ]);
      setTopics(topicsRes.data?.topics || []);
      setDashboard(dashRes.data || null);
    } catch (err) {
      console.error('Failed to load DSA data:', err);
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-3">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Sparkles className="w-8 h-8 text-[#04AA6D]" />
        </motion.div>
        <p className="text-xs text-zinc-500 font-mono">Loading CodeSphere DSA Environment...</p>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const totalSolved = stats.totalSolved || 0;
  const totalProblems = 446; // Exact curriculum problem total!
  const overallCompletion = Math.min(100, Math.round((totalSolved / totalProblems) * 100));
  const userRank = getRankTitle(totalSolved);

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = filterDifficulty === 'all' || t.difficulty === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleSimulate = async (action) => {
    try {
      const res = await dsaAPI.simulateActivity(action);
      setDashboard(res.data);
      if (action === 'solve') {
        toast.success('⚡ Question Solved! Solved count & progress updated 🎉');
      } else if (action === 'streak') {
        toast.success('🔥 Check-in Logged! Streak incremented by +1 Day 🎉');
      } else if (action === 'reset') {
        toast('Activity stats reset');
      }
    } catch (err) {
      toast.error('Failed to update activity');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#04AA6D] selection:text-white">
      {/* CodeSphere Ambient Emerald Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#04AA6D]/20 via-[#10b981]/10 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20">
        
        {/* ═══ HERO HEADER (CODESPHERE EMERALD THEME) ═══ */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-[#04AA6D]/20 border border-[#04AA6D]/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#04AA6D]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> CodeSphere DSA Roadmap
                </span>
                <span className="text-xs text-zinc-400 font-semibold">• 18 Steps & 446 Questions</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  {userRank.badge} {userRank.title}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                DSA Learning Path
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                Complete the 446-question Striver curriculum topic-by-topic. Read theory concepts first, then solve live LeetCode-style problems.
              </p>
            </div>

            {/* Activity Simulation Buttons */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={() => handleSimulate('solve')}
                className="px-3.5 py-2 bg-[#04AA6D]/20 hover:bg-[#04AA6D]/30 text-[#04AA6D] border border-[#04AA6D]/40 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log a solved question to test real-time stat tracking"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> +1 Solved
              </button>

              <button
                onClick={() => handleSimulate('streak')}
                className="px-3.5 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log a daily check-in to test streak tracking"
              >
                <Flame className="w-3.5 h-3.5 text-orange-400" /> +1 Day Streak
              </button>
            </div>
          </div>

          {/* DYNAMIC STATS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
            <div
              onClick={() => handleSimulate('solve')}
              className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-[#04AA6D]/50 transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1 group-hover:text-[#04AA6D]">
                <Target className="w-4 h-4 text-[#04AA6D]" /> Solved Problems
              </div>
              <div className="text-xl font-black text-white">{totalSolved} <span className="text-xs text-zinc-500 font-normal">/ {totalProblems}</span></div>
            </div>

            <div
              onClick={() => handleSimulate('streak')}
              className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-orange-500/50 transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1 group-hover:text-orange-400">
                <Flame className="w-4 h-4 text-orange-400" /> Current Streak
              </div>
              <div className="text-xl font-black text-white">{stats.currentStreak || 0} <span className="text-xs text-zinc-500 font-normal">days</span></div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Overall Progress
              </div>
              <div className="text-xl font-black text-white">{overallCompletion}%</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80">
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4 text-teal-400" /> Avg Solve Time
              </div>
              <div className="text-xl font-black text-white">{stats.averageSolveTime || 15} <span className="text-xs text-zinc-500 font-normal">mins</span></div>
            </div>
          </div>
        </div>

        {/* ═══ DAILY QUEST BANNER ═══ */}
        <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-zinc-950 to-zinc-900/60 border border-[#04AA6D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#04AA6D]/20 border border-[#04AA6D]/40 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Daily Student Challenge</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">+100 XP</span>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">Solve 2 Array or Recursion problems today to extend your daily streak!</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (dashboard?.recommendedProblem) {
                navigate(`/dsa/problem/${dashboard.recommendedProblem.slug}`);
              } else {
                navigate('/dsa/topic/basics');
              }
            }}
            className="px-5 py-2.5 bg-[#04AA6D] hover:bg-[#038d5a] text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-2 cursor-pointer border border-emerald-400/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Quest Now
          </button>
        </div>

        {/* ═══ GITHUB STREAK WIDGET ═══ */}
        <GitHubStreakCard />

        {/* ═══ SEARCH & FILTER BAR ═══ */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18 DSA steps or topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#04AA6D] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-2xl border border-zinc-800/80 w-full sm:w-auto overflow-x-auto">
            {['all', 'beginner', 'intermediate', 'advanced'].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  filterDifficulty === d
                    ? 'bg-[#04AA6D] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ ROADMAP PATH NODES ═══ */}
        <div className="relative space-y-6">
          {filteredTopics.map((topic, i) => {
            const isLocked = false;
            const isCompleted = topic.completionPercent === 100;
            const isCurrent = !isCompleted;
            const stepNum = i + 1 < 10 ? `0${i + 1}` : `${i + 1}`;

            return (
              <motion.div
                key={topic._id || topic.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="relative"
              >
                {/* Visual Connector Line */}
                {i < filteredTopics.length - 1 && (
                  <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#04AA6D]/40 via-zinc-800 to-zinc-900 z-0" />
                )}

                <div className={`relative z-10 p-5 sm:p-6 rounded-3xl border transition-all ${
                  isLocked
                    ? 'bg-zinc-950/60 border-zinc-800/40 opacity-70'
                    : isCurrent
                    ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-[#04AA6D]/20 border-[#04AA6D]/40 shadow-xl ring-1 ring-[#04AA6D]/30'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 shadow-lg'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Left Icon & Details */}
                    <div className="flex items-start gap-4">
                      {/* Step Badge Icon */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 ${
                        isLocked
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                          : isCompleted
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'bg-[#04AA6D]/20 border border-[#04AA6D]/40 text-[#04AA6D]'
                      }`}>
                        {isLocked ? <Lock className="w-5 h-5" /> : topic.icon || stepNum}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[11px] font-mono text-[#04AA6D] font-bold">STEP {stepNum}</span>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                            {topic.title}
                          </h3>
                          <DifficultyBadge difficulty={topic.difficulty} />
                          <span className="px-2.5 py-0.5 bg-[#04AA6D]/15 text-[#04AA6D] text-[10px] font-bold rounded-full border border-[#04AA6D]/30 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> THEORY FIRST
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 max-w-xl line-clamp-2">
                          {topic.description || 'Master core concepts and solve structured problems.'}
                        </p>

                        {/* Questions Count & Hours */}
                        <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-400 flex-wrap">
                          <span>🎯 {topic.userSolved || 0} / {topic.totalProblems || 0} Questions</span>
                          {topic.estimatedHours > 0 && <span>⏱️ ~{topic.estimatedHours}h</span>}
                          <span className="text-amber-400 font-semibold">⚡ +50 XP per solve</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Progress Ring & Action Button */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800/60 pt-3 sm:pt-0">
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-bold text-zinc-300">{topic.completionPercent || 0}%</span>
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-[#04AA6D]'}`}
                            style={{ width: `${topic.completionPercent || 0}%` }}
                          />
                        </div>
                      </div>

                      {!isLocked ? (
                        <button
                          onClick={() => navigate(`/dsa/topic/${topic.slug}`)}
                          className="px-4.5 py-2.5 bg-[#04AA6D] hover:bg-[#038d5a] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-emerald-400/30"
                        >
                          Start Step <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-xs text-zinc-600 font-mono flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
