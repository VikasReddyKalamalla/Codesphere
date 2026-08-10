import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Star, Crown, Medal, Sparkles, User, Zap } from 'lucide-react';
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
    if (rank === 1) return <Crown className="w-6 h-6 text-amber-400 fill-amber-400 animate-bounce drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-300 fill-slate-300/40" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600 fill-amber-600/40" />;
    return <span className="text-xs font-black font-mono text-slate-400 dark:text-slate-500">#{rank}</span>;
  };

  const formattedXp = (xp) => {
    if (!xp) return '0 XP';
    return String(xp).includes('XP') ? xp : `${xp} XP`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 md:p-6 text-slate-900 dark:text-slate-100 font-sans animate-fade-in">
      <BackButton fallbackPath="/dashboard" />

      {/* ── CodeSphere Premium Hero Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 md:p-8 text-white shadow-xl border border-emerald-500/30">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-teal-300/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-white/15 backdrop-blur-md border border-white/20 text-emerald-100 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span>🏆 GLOBAL RANKINGS</span>
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight font-mono text-white">
              CodeSphere Leaderboard
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Compete with top developers worldwide. Solve DSA problems, complete interactive assessments, and maintain your daily streak to climb the ranks!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/25 shrink-0 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-300/40 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-emerald-300 fill-emerald-300 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-black font-mono leading-none text-white">Weekly Reset</p>
              <p className="text-[10px] text-emerald-200 mt-1 font-mono uppercase tracking-wider">Resets every Sunday at 00:00 UTC</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Leaderboard Table Container ── */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm backdrop-blur-md flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 font-mono">
            <Trophy className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" />
            Top Developers & Students
          </h3>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {['all', 'weekly', 'monthly'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                  filter === t
                    ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-[#04AA6D] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {leaders.map((user, idx) => {
              const rank = user.rank || idx + 1;
              const isFirst = rank === 1;

              return (
                <div
                  key={user.rank || idx}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isFirst
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/30 border-[#04AA6D]/40 shadow-md shadow-emerald-500/5'
                      : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800/80 hover:border-[#04AA6D]/40 dark:hover:border-[#04AA6D]/40'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 flex justify-center items-center shrink-0">
                      {getRankBadge(rank)}
                    </div>
                    <div className={`w-12 h-12 rounded-full overflow-hidden shrink-0 ${
                      isFirst
                        ? 'border-2 border-[#04AA6D] ring-2 ring-emerald-500/20 bg-slate-800'
                        : 'border-2 border-slate-200 dark:border-slate-700 bg-slate-800'
                    }`}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2 font-mono truncate">
                        {user.name}
                        {isFirst && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#04AA6D] text-white uppercase tracking-wider shrink-0">
                            LEADER
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Accuracy: {user.score}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#04AA6D] dark:fill-emerald-400 text-[#04AA6D] dark:text-emerald-400" />
                      <span>{formattedXp(user.xp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;

