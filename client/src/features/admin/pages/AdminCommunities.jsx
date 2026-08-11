import React, { useEffect, useState } from 'react';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';
import { MessageSquare, Star, Trash2, Users, Shield, Lock, Unlock } from 'lucide-react';

export const AdminCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const res = await apiClient.get('/community');
      const data = res.data?.data?.communities || res.data?.communities || res.data || [];
      setCommunities(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load community spaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleToggleFeature = async (id, isFeatured) => {
    try {
      await apiClient.put(`/community/${id}`, { isFeatured: !isFeatured });
      toast.success(isFeatured ? 'Removed from featured' : 'Marked as featured community');
      fetchCommunities();
    } catch (err) {
      toast.error('Failed to update community status');
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (!confirm('Are you sure you want to delete this community space?')) return;
    try {
      await apiClient.delete(`/community/${id}`);
      toast.success('Community deleted successfully');
      fetchCommunities();
    } catch (err) {
      toast.error('Failed to delete community');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-500" />
          Community Spaces Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Moderate developer communities, feature active learning circles, and manage access.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-6">No communities found.</p>
          ) : (
            communities.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {c.category || 'General Tech'}
                    </span>
                    <button
                      onClick={() => handleDeleteCommunity(c._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Community"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{c.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-bold">
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>{c.memberCount || c.membersCount || 1} Members</span>
                  </div>

                  <button
                    onClick={() => handleToggleFeature(c._id, c.isFeatured)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      c.isFeatured
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${c.isFeatured ? 'fill-amber-500' : ''}`} />
                    <span>{c.isFeatured ? 'Featured' : 'Feature'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default AdminCommunities;
