import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Flame, BarChart2, Award, Clock, CheckCircle, Zap } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';
import toast from 'react-hot-toast';

export default function DSAProgressPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dsaAPI.getDashboard().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      toast.error('Failed to load dashboard');
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Zap className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>

      <h1 className="text-2xl font-black">Your Learning Progress</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="text-xs text-zinc-400">Total Solved</div>
          <div className="text-2xl font-black text-indigo-400">{stats.totalSolved || 0}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="text-xs text-zinc-400">Easy Solved</div>
          <div className="text-2xl font-black text-emerald-400">{stats.easySolved || 0}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="text-xs text-zinc-400">Medium Solved</div>
          <div className="text-2xl font-black text-amber-400">{stats.mediumSolved || 0}</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="text-xs text-zinc-400">Hard Solved</div>
          <div className="text-2xl font-black text-red-400">{stats.hardSolved || 0}</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-bold">Recently Solved Problems</h2>
        <div className="space-y-2">
          {data?.recentlySolved?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <span className="text-xs font-medium text-zinc-200">{item.problemId?.title}</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Solved</span>
            </div>
          ))}
          {(!data?.recentlySolved || data.recentlySolved.length === 0) && (
            <div className="text-xs text-zinc-500 py-4 text-center">No solved problems yet. Start solving!</div>
          )}
        </div>
      </div>
    </div>
  );
}
