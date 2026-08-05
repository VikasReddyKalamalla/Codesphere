import React, { useState, useEffect } from 'react';
import apiClient from '../../../api/axios.js';
import { socket } from '../../../socket/socket.js';
import { 
  Megaphone, 
  Heart, 
  Repeat, 
  Eye, 
  Pin, 
  Share2, 
  Check, 
  Search, 
  Rocket, 
  Wrench, 
  Users, 
  ShieldAlert, 
  RefreshCw 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const UserAnnouncementsFeed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/announcements', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery.trim() || undefined,
        },
        suppressErrorToast: true,
      });
      if (res.data?.announcements) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.warn('[UserAnnouncements] Error fetching announcements:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    if (socket) {
      const handleNewAnnouncement = (data) => {
        if (data?.announcement || data?.title) {
          const newDoc = data.announcement || data;
          setAnnouncements((prev) => [newDoc, ...prev.filter((a) => a._id !== newDoc._id)]);
          toast.success(`📢 New Announcement: ${newDoc.title}`, {
            duration: 5000,
            style: { background: '#0f172a', color: '#10b981', border: '1px solid #059669' },
          });
        }
      };

      socket.on('notification:announcement', handleNewAnnouncement);
      socket.on('announcement:new', handleNewAnnouncement);

      return () => {
        socket.off('notification:announcement', handleNewAnnouncement);
        socket.off('announcement:new', handleNewAnnouncement);
      };
    }
  }, [selectedCategory, searchQuery]);

  const categories = [
    { id: 'all', label: 'All Announcements' },
    { id: 'Update', label: 'Updates' },
    { id: 'Release', label: 'Releases' },
    { id: 'Maintenance', label: 'Maintenance' },
    { id: 'Community', label: 'Community' },
    { id: 'Security', label: 'Security' },
  ];

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Release':
        return { label: 'Feature Release', icon: Rocket, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' };
      case 'Maintenance':
        return { label: 'Maintenance', icon: Wrench, color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' };
      case 'Security':
        return { label: 'Security Alert', icon: ShieldAlert, color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' };
      case 'Community':
        return { label: 'Community Event', icon: Users, color: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30' };
      case 'Update':
      default:
        return { label: 'System Update', icon: Megaphone, color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30' };
    }
  };

  const handleLike = async (id) => {
    try {
      await apiClient.post(`/announcements/${id}/like`);
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === id ? { ...a, likesCount: (a.likesCount || 0) + 1 } : a))
      );
    } catch (e) {}
  };

  const handleRepost = async (id) => {
    try {
      await apiClient.post(`/announcements/${id}/repost`);
      toast.success('Announcement reposted!');
      setAnnouncements((prev) =>
        prev.map((a) => (a._id === id ? { ...a, repostsCount: (a.repostsCount || 0) + 1 } : a))
      );
    } catch (e) {}
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Announcement link copied to clipboard!');
  };

  return (
    <div className="flex flex-col gap-4 w-full font-sans text-slate-900 dark:text-slate-100">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* Feed Stream */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
          <p className="text-xs font-mono text-slate-400">Loading Official CodeSphere Announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center px-4">
          <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Announcements Match Your Filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Try switching category filters to view all official CodeSphere announcements.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {announcements.map((item) => {
            const catInfo = getCategoryBadge(item.category);
            const CatIcon = catInfo.icon;
            const authorName = item.createdBy?.fullName || 'CodeSphere Team';
            const timeFormatted = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
              : 'Just now';

            return (
              <div
                key={item._id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col gap-3.5 ${
                  item.isPinned
                    ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Pinned Header */}
                {item.isPinned && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pb-1 border-b border-emerald-100 dark:border-emerald-900/30">
                    <Pin className="w-3.5 h-3.5 fill-current" />
                    <span>Pinned Official Announcement</span>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-emerald-500/20 shrink-0">
                      CS
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          {authorName}
                          <Check className="w-3.5 h-3.5 text-white bg-emerald-600 rounded-full p-0.5" />
                        </span>
                        <span className="text-xs text-slate-500 font-mono">@CodeSphere</span>
                        <span className="text-xs text-slate-400 font-mono">· {timeFormatted}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${catInfo.color}`}>
                          <CatIcon className="w-2.5 h-2.5" />
                          {catInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                    {item.message}
                  </p>

                  {item.mediaUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72">
                      <img
                        src={item.mediaUrl}
                        alt="Announcement Attachment"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Twitter/X Style Action Bar */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 font-mono">
                  <button
                    onClick={() => handleLike(item._id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{item.likesCount || 0}</span>
                  </button>

                  <button
                    onClick={() => handleRepost(item._id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Repeat className="w-4 h-4" />
                    <span>{item.repostsCount || 0}</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span>{(item.viewsCount || 0) + 8}</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
