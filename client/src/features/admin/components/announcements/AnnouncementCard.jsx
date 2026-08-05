import React, { useState } from 'react';
import { 
  Heart, 
  Repeat, 
  Eye, 
  Pin, 
  Trash2, 
  Edit3, 
  Share2, 
  Check, 
  Megaphone, 
  Rocket, 
  Wrench, 
  Users, 
  ShieldAlert, 
  MoreHorizontal 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AnnouncementCard = ({ 
  announcement, 
  onLike, 
  onRepost, 
  onTogglePin, 
  onDelete, 
  onEdit 
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [likesCount, setLikesCount] = useState(announcement.likesCount || 0);
  const [repostsCount, setRepostsCount] = useState(announcement.repostsCount || 0);

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

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    if (onLike) onLike(announcement._id);
  };

  const handleRepost = () => {
    if (isReposted) {
      setIsReposted(false);
      setRepostsCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsReposted(true);
      setRepostsCount((prev) => prev + 1);
      toast.success('Announcement reposted to community feed!');
    }
    if (onRepost) onRepost(announcement._id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Announcement link copied to clipboard!');
  };

  const categoryInfo = getCategoryBadge(announcement.category);
  const CategoryIcon = categoryInfo.icon;
  const authorName = announcement.createdBy?.fullName || 'CodeSphere Admin';

  const timeFormatted = announcement.createdAt
    ? new Date(announcement.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : 'Just now';

  return (
    <div className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col gap-3.5 hover:border-slate-300 dark:hover:border-slate-700 ${
      announcement.isPinned 
        ? 'border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      {/* Pinned Badge Header if pinned */}
      {announcement.isPinned && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pb-1 border-b border-emerald-100 dark:border-emerald-900/30">
          <Pin className="w-3.5 h-3.5 fill-current" />
          <span>Pinned Announcement</span>
        </div>
      )}

      {/* Header: Author Avatar, Name, Handle, Category Badge, Time */}
      <div className="flex items-start justify-between gap-3">
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
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${categoryInfo.color}`}>
                <CategoryIcon className="w-2.5 h-2.5" />
                {categoryInfo.label}
              </span>
              {announcement.targetAudience && announcement.targetAudience !== 'All' && (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {announcement.targetAudience}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Admin Quick Actions: Pin, Edit, Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onTogglePin && onTogglePin(announcement._id)}
            className={`p-1.5 rounded-lg border transition-all ${
              announcement.isPinned 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-transparent hover:border-slate-200'
            }`}
            title={announcement.isPinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin className={`w-3.5 h-3.5 ${announcement.isPinned ? 'fill-current' : ''}`} />
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(announcement)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Edit Announcement"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(announcement._id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete Announcement"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Body Content */}
      <div className="flex flex-col gap-1.5 pl-13">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          {announcement.title}
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
          {announcement.message}
        </p>

        {/* Media Image Attachment if present */}
        {announcement.mediaUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-72">
            <img
              src={announcement.mediaUrl}
              alt="Announcement Attachment"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Twitter/X Style Action Toolbar */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-500 font-mono">
        {/* Like Heart */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            isLiked
              ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
              : 'hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-rose-600 animate-bounce' : ''}`} />
          <span>{likesCount}</span>
        </button>

        {/* Repost */}
        <button
          onClick={handleRepost}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            isReposted
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
              : 'hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Repeat className={`w-4 h-4 ${isReposted ? 'text-emerald-600' : ''}`} />
          <span>{repostsCount}</span>
        </button>

        {/* Views Count */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400">
          <Eye className="w-4 h-4" />
          <span>{(announcement.viewsCount || 0) + 12}</span>
        </div>

        {/* Share Link */}
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
};
