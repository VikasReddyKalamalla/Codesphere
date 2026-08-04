import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { dsaAPI } from '../services/dsaAPI';

export default function DSASearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await dsaAPI.search({ q: query });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate('/dsa')} className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Roadmap
      </button>
      <h1 className="text-2xl font-black">Search DSA Roadmap</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems, topics, tags (e.g. Array, Sliding Window, Two Sum)..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="px-5 py-3 bg-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-500 flex items-center gap-2">
          <SearchIcon className="w-4 h-4" /> Search
        </button>
      </form>

      {results && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-zinc-400">Problems ({results.problems?.length || 0})</h2>
          <div className="space-y-2">
            {results.problems?.map((p) => (
              <div key={p._id} onClick={() => navigate(`/dsa/problem/${p.slug}`)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700">
                <div className="text-sm font-bold text-white">{p.title}</div>
                <span className="text-[10px] font-bold uppercase text-zinc-400">{p.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
