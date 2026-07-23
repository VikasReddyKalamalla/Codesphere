import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Bookmark, Trophy, ExternalLink, Globe, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export const EventCard = ({
  event,
  isBookmarked = false,
  isRegistered = false,
  onSelect,
  onBookmark,
  onRegister
}) => {
  const {
    _id,
    title,
    description,
    bannerImage,
    thumbnail,
    eventType,
    mode,
    country,
    city,
    startDate,
    prizePool,
    registeredParticipants = 0,
    maxParticipants = 0,
    categoryColor = '#04AA6D',
    categoryName = 'Hackathon',
    companyName = 'CodeSphere Partner',
    isFeatured,
    isTrending,
  } = event;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect && onSelect(event)}
      className="group relative bg-slate-50/90 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-[#04AA6D]/50 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none cursor-pointer overflow-hidden"
    >
      {/* Background Neon Glow */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity bg-[#04AA6D]"
      />

      <div className="flex flex-col gap-4">
        {/* Banner image or preview header */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <img
            src={bannerImage || thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
            <span
              className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono shadow-md backdrop-blur-md border bg-slate-950/80 text-emerald-400 border-emerald-500/40"
            >
              {eventType ? eventType.replace('_', ' ') : categoryName}
            </span>

            <div className="flex items-center gap-1.5">
              {isTrending && (
                <span className="flex items-center gap-1 text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono backdrop-blur-md">
                  <Flame className="w-3 h-3 fill-rose-400" />
                  TRENDING
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark && onBookmark(event);
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

          {/* Mode tag bottom right */}
          <div className="absolute bottom-2.5 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-700 text-[9px] font-bold text-slate-200 uppercase font-mono">
            {mode}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="text-[#04AA6D] font-bold">{companyName}</span>
            {prizePool && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <Trophy className="w-3 h-3" />
                {prizePool}
              </span>
            )}
          </div>

          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>

      {/* Footer details */}
      <div className="flex flex-col gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 font-sans">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#04AA6D] shrink-0" />
            <span className="truncate max-w-[120px]">{city}, {country}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>{new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>{registeredParticipants} {maxParticipants > 0 ? `/ ${maxParticipants}` : ''} Registered</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister && onRegister(event);
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              isRegistered
                ? 'bg-emerald-500/15 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-gradient-to-r from-[#04AA6D] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30'
            }`}
          >
            {isRegistered ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Registered
              </>
            ) : (
              <>Register</>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default EventCard;
