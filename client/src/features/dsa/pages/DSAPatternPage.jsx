import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';

export default function DSAPatternPage() {
  const navigate = useNavigate();
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    dsaAPI.getPatterns().then(res => setPatterns(res.data.patterns || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>
      <h1 className="text-2xl font-black">Coding Patterns</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {patterns.map((p, i) => (
          <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
            </div>
            <div className="text-xs text-zinc-400">{p.count} problems</div>
          </div>
        ))}
      </div>
    </div>
  );
}
