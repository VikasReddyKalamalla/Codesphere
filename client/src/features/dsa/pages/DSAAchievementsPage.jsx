import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Lock, CheckCircle2 } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';

export default function DSAAchievementsPage() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    dsaAPI.getAchievements().then(res => setAchievements(res.data.achievements || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>
      <h1 className="text-2xl font-black">Achievements Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((a, i) => (
          <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${
            a.isUnlocked ? 'bg-indigo-950/40 border-indigo-500/40' : 'bg-zinc-950 border-zinc-800 opacity-60'
          }`}>
            <div className="text-3xl">{a.icon}</div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {a.title}
                {a.isUnlocked ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-zinc-500" />}
              </h3>
              <p className="text-xs text-zinc-400">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
