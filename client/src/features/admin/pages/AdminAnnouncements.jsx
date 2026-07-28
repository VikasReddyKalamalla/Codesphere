import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../api/axios.js';
import { AnnouncementComposer } from '../components/announcements/AnnouncementComposer.jsx';
import { AnnouncementCard } from '../components/announcements/AnnouncementCard.jsx';
import { AnnouncementSidebar } from '../components/announcements/AnnouncementSidebar.jsx';
import { Megaphone, Search, RefreshCw, Sparkles, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch announcements from backend API
  const fetchAnnouncements = useCallback(async () => {
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
      console.warn('[Announcements] Load skipped:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Handle new Announcement submission
  const handlePostAnnouncement = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/announcements', formData);
      if (res.data?.announcement) {
        toast.success('Announcement published live to CodeSphere!', {
          icon: '📢',
          style: { background: '#0f172a', color: '#10b981', border: '1px solid #059669' },
        });

        // Broadcast to users if required
        try {
          await apiClient.post(`/announcements/${res.data.announcement._id}/broadcast`);
        } catch (bErr) {
          // Silent catch for broadcast log
        }

        fetchAnnouncements();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Pin
  const handleTogglePin = async (id) => {
    try {
      const res = await apiClient.post(`/announcements/${id}/pin`);
      if (res.data?.announcement) {
        toast.success(res.data.message || 'Pin status updated!');
        fetchAnnouncements();
      }
    } catch (err) {
      toast.error('Failed to toggle pin');
    }
  };

  // Handle Like
  const handleLike = async (id) => {
    try {
      await apiClient.post(`/announcements/${id}/like`);
    } catch (err) {
      // Silent catch
    }
  };

  // Handle Repost
  const handleRepost = async (id) => {
    try {
      await apiClient.post(`/announcements/${id}/repost`);
    } catch (err) {
      // Silent catch
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await apiClient.delete(`/announcements/${id}`);
      toast.success('Announcement deleted');
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error('Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-10 font-sans text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
            <Megaphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Platform Announcements Feed
              </h1>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Live Broadcast Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Publish Twitter/X-style announcements, updates, feature releases, and emergency alerts to CodeSphere users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={fetchAnnouncements}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>
      </div>

      {/* Main Content Layout: Composer & Feed (Left 2 cols), Analytics Sidebar (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Twitter/X Style Composer Box */}
          <AnnouncementComposer
            onPostAnnouncement={handlePostAnnouncement}
            isSubmitting={isSubmitting}
          />

          {/* Feed Search & Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Broadcast Feed ({filteredAnnouncements.length})
              </h2>
            </div>

            {/* Search Input */}
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

          {/* Announcement Feed List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
              <p className="text-xs font-mono text-slate-400">Loading CodeSphere Announcement Feed...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center px-4">
              <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Announcements Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Use the composer box above to post your first announcement live to CodeSphere!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredAnnouncements.map((item) => (
                <AnnouncementCard
                  key={item._id}
                  announcement={item}
                  onLike={handleLike}
                  onRepost={handleRepost}
                  onTogglePin={handleTogglePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar: Analytics & Quick Filters */}
        <div className="flex flex-col gap-6">
          <AnnouncementSidebar
            announcements={announcements}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
