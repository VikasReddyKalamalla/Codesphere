import React from 'react';
import { Megaphone, Pin, Eye, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

export const AnnouncementSidebar = ({ announcements = [], selectedCategory, onSelectCategory }) => {
  const totalPosts = announcements.length;
  const pinnedPosts = announcements.filter((a) => a.isPinned);
  const totalViews = announcements.reduce((sum, a) => sum + (a.viewsCount || 12), 0);

  const categories = [
    { id: 'all', label: 'All Announcements' },
    { id: 'Update', label: 'System Updates' },
    { id: 'Release', label: 'Feature Releases' },
    { id: 'Maintenance', label: 'Maintenance' },
    { id: 'Community', label: 'Community Events' },
    { id: 'Security', label: 'Security Alerts' },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans text-slate-900 dark:text-slate-100">
      {/* Stats Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Broadcast Analytics
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 font-mono">Total Posts</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
              {totalPosts}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 font-mono">Total Views</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {totalViews.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Navigation Filter Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Megaphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          Category Filter
        </h3>

        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? announcements.length
              : announcements.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pinned Announcements List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Pin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
          Pinned Highlights ({pinnedPosts.length})
        </h3>

        {pinnedPosts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {pinnedPosts.map((post) => (
              <div key={post._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {post.title}
                </span>
                <span className="text-[11px] text-slate-500 line-clamp-2">
                  {post.message}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-mono text-center py-3">
            No pinned posts. Click the pin icon on any announcement to pin it here.
          </p>
        )}
      </div>
    </div>
  );
};
