import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Award, ShieldAlert, Sparkles, TrendingUp, Search, Crown } from 'lucide-react';
import apiClient from '@services/axios.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, weekly, monthly

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/tests/leaderboard');
        const data = res.data?.data || res.data || res;
        setLeaders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce" />;
    if (rank === 2) return <Crown className="w-5 h-5 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Crown className="w-5 h-5 text-amber-700 fill-amber-700" />;
    return <span className="text-xs font-black font-mono text-slate-500">#{rank}</span>;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 md:p-6 text-slate-900 dark:text-slate-100 font-sans animate-fade-in">
      <BackButton fallbackPath="/dashboard" />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md">
                🏆 Global Rankings
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">CodeSphere Leaderboard</h1>
            <p className="text-xs md:text-sm text-amber-100 max-w-xl">
              Compete with top developers worldwide. Solve DSA problems, complete interactive assessments, and maintain your daily streak to climb the ranks!
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
            <Flame className="w-8 h-8 text-amber-300 fill-amber-300 animate-pulse" />
            <div>
              <p className="text-lg font-black leading-none">Weekly Reset</p>
              <p className="text-[10px] text-amber-200 mt-1 font-mono uppercase">Resets every Sunday at 00:00 UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm backdrop-blur-md flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Developers & Students
          </h3>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {['all', 'weekly', 'monthly'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  filter === t
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leaders.map((user, idx) => (
              <div
                key={user.rank || idx}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:border-amber-500/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 flex justify-center items-center">
                    {getRankBadge(user.rank || idx + 1)}
                  </div>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/30 bg-slate-200 dark:bg-slate-800 shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {user.name}
                      {idx === 0 && <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white uppercase font-mono">Leader</span>}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Accuracy: {user.score}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{user.xp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default LeaderboardPage;
