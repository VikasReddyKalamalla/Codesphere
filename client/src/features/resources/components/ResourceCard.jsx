import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Code, Video, BookOpen, Download, Eye, Bookmark, Star, Sparkles,
  GitBranch, Layers, Trophy, CheckCircle2, ShieldCheck, Flame, ExternalLink
} from 'lucide-react';

const TYPE_CONFIG = {
  pdf: { label: 'PDF Notes', icon: FileText, color: 'text-red-500 bg-red-500/10 border-red-500/30' },
  ppt: { label: 'PowerPoint (.ppt)', icon: FileText, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  word: { label: 'Word Doc (.docx)', icon: FileText, color: 'text-blue-600 bg-blue-600/10 border-blue-600/30' },
  video: { label: 'Video Tutorial', icon: Video, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  source_code: { label: 'Source Code', icon: Code, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  github: { label: 'GitHub Repo', icon: GitBranch, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  notes: { label: 'Cheat Sheet', icon: Layers, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  documentation: { label: 'Doc & API', icon: BookOpen, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' },
  zip: { label: 'Project ZIP', icon: Trophy, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
  default: { label: 'Resource', icon: FileText, color: 'text-[#04AA6D] bg-[#04AA6D]/10 border-[#04AA6D]/30' }
};

export const ResourceCard = ({
  resource,
  isBookmarked = false,
  onSelect,
  onBookmark,
  onDownload
}) => {
  if (!resource) return null;

  const {
    _id,
    title,
    description,
    resourceType,
    thumbnail,
    views = 0,
    downloadsCount = 0,
    averageRating = 4.8,
    isPremium,
    isFeatured,
    isTrending,
    tags = [],
    uploadedBy,
    instructor,
  } = resource;

  const typeConfig = TYPE_CONFIG[resourceType] || TYPE_CONFIG.default;
  const TypeIcon = typeConfig.icon;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect && onSelect(resource)}
      className="group relative bg-slate-50/90 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-[#04AA6D]/50 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none cursor-pointer overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity bg-[#04AA6D]" />

      <div className="flex flex-col gap-4">
        {/* Header Preview / Banner Box */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <TypeIcon className={`w-10 h-10 ${typeConfig.color.split(' ')[0]}`} />
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{typeConfig.label}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

          {/* Top Row Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono shadow-md backdrop-blur-md border ${typeConfig.color}`}>
              {typeConfig.label}
            </span>

            <div className="flex items-center gap-1.5">
              {isPremium && (
                <span className="flex items-center gap-1 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  PREMIUM
                </span>
              )}
              {isTrending && (
                <span className="flex items-center gap-1 text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono backdrop-blur-md">
                  <Flame className="w-3 h-3 fill-rose-300" />
                  HOT
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark && onBookmark(resource);
                }}
                className={`p-1.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#04AA6D] text-white shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="text-[#04AA6D] font-bold">
              {instructor || uploadedBy?.fullName || 'CodeSphere Author'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{averageRating || 4.9}</span>
            </div>
          </div>

          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {description}
          </p>

          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer details */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {views}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            {downloadsCount}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(resource);
          }}
          className="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          View Resource
        </button>
      </div>
    </motion.div>
  );
};
export default ResourceCard;
