import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Target, Flame, BookOpen, Lock, Unlock, ChevronRight,
  Star, Zap, TrendingUp, Search, Award, BarChart3, Clock,
  CheckCircle2, ArrowRight, Sparkles, Play
} from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';

const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
    beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[difficulty] || colors.easy}`}>
      {difficulty}
    </span>
  );
};

const StreakFire = ({ count }) => (
  <div className="flex items-center gap-1.5">
    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
      <Flame className="w-5 h-5 text-orange-400" />
    </motion.div>
    <span className="text-lg font-black text-white">{count}</span>
    <span className="text-xs text-zinc-400">day streak</span>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 flex flex-col gap-2 hover:border-zinc-700 transition-all group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <span className="text-2xl font-black text-white">{value}</span>
    <span className="text-xs text-zinc-400 font-medium">{label}</span>
  </motion.div>
);

const TopicCard = ({ topic, index, onNavigate }) => {
  const isLocked = topic.isLocked;
  const isCompleted = topic.completionPercent >= 100;
  const isCurrent = !isLocked && !isCompleted && topic.completionPercent > 0;
  const isNew = !isLocked && topic.completionPercent === 0 && !isCompleted;

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, type: 'spring' }}
      className="relative"
    >
      {/* Connecting Line */}
      {index > 0 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-8">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`w-full h-full origin-top ${isLocked ? 'bg-zinc-800' : 'bg-gradient-to-b from-zinc-600 to-zinc-400'}`}
          />
        </div>
      )}

      {/* Topic Card */}
      <motion.button
        onClick={() => !isLocked && onNavigate(topic.slug)}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        className={`w-full text-left rounded-2xl border p-5 transition-all relative overflow-hidden group ${
          isLocked
            ? 'bg-zinc-950 border-zinc-800/50 opacity-60 cursor-not-allowed'
            : isCompleted
            ? 'bg-gradient-to-br from-emerald-950/50 to-zinc-900 border-emerald-700/50 cursor-pointer'
            : isCurrent
            ? 'bg-gradient-to-br from-indigo-950/50 to-zinc-900 border-indigo-500/50 cursor-pointer ring-1 ring-indigo-500/20'
            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 cursor-pointer'
        }`}
      >
        {/* Glow effect for current */}
        {isCurrent && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl"
          />
        )}

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
            isLocked ? 'bg-zinc-800' : ''
          }`} style={!isLocked ? { backgroundColor: `${topic.color}20` } : {}}>
            {isLocked ? <Lock className="w-6 h-6 text-zinc-600" /> : (
              isCompleted ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <span>{topic.icon}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-bold truncate ${isLocked ? 'text-zinc-600' : 'text-white'}`}>
                {topic.title}
              </h3>
              <DifficultyBadge difficulty={topic.difficulty} />
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full border border-indigo-500/30"
                >
                  CONTINUE
                </motion.span>
              )}
            </div>

            <p className={`text-xs mb-3 line-clamp-1 ${isLocked ? 'text-zinc-700' : 'text-zinc-400'}`}>
              {topic.description || topic.introduction?.substring(0, 80) || `Master ${topic.title} concepts and problems`}
            </p>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.completionPercent || 0}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                />
              </div>
              <span className={`text-xs font-bold tabular-nums ${isLocked ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {topic.completionPercent || 0}%
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-500">
              <span>{topic.userSolved || 0}/{topic.totalProblems} solved</span>
              {topic.estimatedHours > 0 && <span>~{topic.estimatedHours}h</span>}
              {topic.interviewCompanies?.length > 0 && (
                <span className="truncate">{topic.interviewCompanies.slice(0, 3).join(', ')}</span>
              )}
            </div>

            {/* Lock message */}
            {isLocked && topic.unlockMessage && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-600">
                <Lock className="w-3 h-3" />
                <span>{topic.unlockMessage}</span>
              </div>
            )}
          </div>

          {/* Arrow */}
          {!isLocked && (
            <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors shrink-0 mt-1" />
          )}
        </div>
      </motion.button>
    </motion.div>
  );
};

export default function DSARoadmapPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Zap className="w-8 h-8 text-indigo-500" />
        </motion.div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-black to-purple-950/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">DSA Learning Path</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-2">
              Master Data Structures
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> & Algorithms</span>
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg">
              Your structured journey from fundamentals to advanced topics. Complete topics sequentially to unlock the next level.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard icon={Target} label="Problems Solved" value={stats.totalSolved || 0} color="bg-indigo-600" delay={0} />
            <StatCard icon={Flame} label="Current Streak" value={`${stats.currentStreak || 0}d`} color="bg-orange-600" delay={0.1} />
            <StatCard icon={TrendingUp} label="Completion" value={`${dashboard?.totalProblems ? Math.round(((stats.totalSolved || 0) / dashboard.totalProblems) * 100) : 0}%`} color="bg-emerald-600" delay={0.2} />
            <StatCard icon={Clock} label="Avg Solve Time" value={`${stats.averageSolveTime || 0}m`} color="bg-purple-600" delay={0.3} />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {dashboard?.recommendedProblem && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => navigate(`/dsa/problem/${dashboard.recommendedProblem.slug}`)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all"
              >
                <Play className="w-4 h-4" />
                Continue: {dashboard.recommendedProblem.title}
              </motion.button>
            )}
            <button onClick={() => navigate('/dsa/progress')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-all">
              <BarChart3 className="w-4 h-4" /> Progress
            </button>
            <button onClick={() => navigate('/dsa/search')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-all">
              <Search className="w-4 h-4" /> Search
            </button>
            <button onClick={() => navigate('/dsa/revision')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-all">
              <BookOpen className="w-4 h-4" /> Revision {dashboard?.revisionDue > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{dashboard.revisionDue}</span>}
            </button>
            <button onClick={() => navigate('/dsa/achievements')} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-sm font-medium text-zinc-300 transition-all">
              <Award className="w-4 h-4" /> Achievements
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Your Journey</h2>
          <span className="text-xs text-zinc-500 ml-2">{topics.length} topics</span>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {topics.map((topic, i) => (
              <TopicCard
                key={topic._id || topic.slug}
                topic={topic}
                index={i}
                onNavigate={(slug) => navigate(`/dsa/topic/${slug}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
