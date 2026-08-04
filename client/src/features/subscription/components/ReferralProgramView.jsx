import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Share2, Copy, Check, Trophy } from 'lucide-react';
import { selectReferralData } from '../redux';

export const ReferralProgramView = () => {
  const referralData = useSelector(selectReferralData);
  const [copied, setCopied] = useState(false);

  const code = referralData?.referralCode || 'CS-PROMO2026';
  const link = referralData?.referralLink || `https://codesphere.dev/register?ref=${code}`;
  const totalEarned = referralData?.totalEarned || 1500;
  const totalReferrals = referralData?.totalReferrals || 6;

  const leaderboard = referralData?.leaderboard || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Developer Referral Program
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400">Invite fellow engineers and earn ₹250 wallet credits for every subscription</p>
      </div>

      {/* Rewards Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-slate-50 dark:to-slate-900 border border-emerald-500/30">
          <div className="text-xs text-slate-600 dark:text-slate-400">Total Rewards Earned</div>
          <div className="text-2xl font-black font-mono text-[#04AA6D] dark:text-emerald-300 mt-1">₹{totalEarned.toLocaleString()}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400">Friends Invited</div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">{totalReferrals}</div>
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-600 dark:text-slate-400">Reward Per Referral</div>
          <div className="text-2xl font-black font-mono text-amber-500 dark:text-amber-400 mt-1">₹250</div>
        </div>
      </div>

      {/* Shareable Link Generator */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Your Personal Share Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={link}
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-[#04AA6D] dark:text-emerald-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-5 py-3 bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Link!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Top Referral Advocates
        </h3>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((user, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 w-4">#{user.rank || idx + 1}</span>
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-slate-900 dark:text-white font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 dark:text-slate-400">{user.count} Referrals</span>
                  <span className="font-mono font-bold text-[#04AA6D] dark:text-emerald-400">₹{user.earned.toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 font-mono py-2 text-center">No referral advocates yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
