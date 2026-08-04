import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Zap } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';

export default function DSARevisionPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dsaAPI.getRevision().then(res => {
      setItems(res.data.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>
      <h1 className="text-2xl font-black">Revision Queue</h1>
      {loading ? <Zap className="w-6 h-6 animate-spin text-indigo-500" /> : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} onClick={() => navigate(`/dsa/problem/${item.problemId?.slug}`)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700">
              <div>
                <div className="text-sm font-bold text-white">{item.problemId?.title}</div>
                <div className="text-xs text-zinc-500">{item.problemId?.topicId?.title}</div>
              </div>
              <Bookmark className="w-4 h-4 text-amber-400" />
            </div>
          ))}
          {items.length === 0 && <div className="text-xs text-zinc-500">No items marked for revision</div>}
        </div>
      )}
    </div>
  );
}
