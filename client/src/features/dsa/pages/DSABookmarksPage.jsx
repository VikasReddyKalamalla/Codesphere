import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';

export default function DSABookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dsaAPI.getBookmarks().then(res => {
      setBookmarks(res.data.bookmarks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>
      <h1 className="text-2xl font-black">Bookmarked Problems</h1>
      {loading ? <Zap className="w-6 h-6 animate-spin text-indigo-500" /> : (
        <div className="space-y-3">
          {bookmarks.map((bm, i) => (
            <div key={i} onClick={() => navigate(`/dsa/problem/${bm.problemId?.slug}`)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700">
              <div>
                <div className="text-sm font-bold text-white">{bm.problemId?.title}</div>
                <div className="text-xs text-zinc-500">{bm.problemId?.topicId?.title}</div>
              </div>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          ))}
          {bookmarks.length === 0 && <div className="text-xs text-zinc-500">No bookmarked problems</div>}
        </div>
      )}
    </div>
  );
}
