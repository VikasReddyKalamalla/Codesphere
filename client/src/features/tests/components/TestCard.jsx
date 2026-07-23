import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock, Award, HelpCircle, Star, Sparkles, Bookmark, Flame, CheckCircle2,
  ChevronRight, Play, Trophy, Cpu, Code
} from 'lucide-react';

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  intermediate: { label: 'Intermediate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  advanced: { label: 'Advanced', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  expert: { label: 'Expert', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' }
};

export const TestCard = ({
  test,
  isBookmarked = false,
  onSelect,
  onBookmark,
  onStart
}) => {
  if (!test) return null;

  const {
    _id,
    title,
    description,
    difficulty = 'beginner',
    technology = 'Full Stack',
    duration = 45,
    totalQuestions = 15,
    totalMarks = 100,
    passingMarks = 60,
    thumbnail,
    attemptCount = 0,
    isPremium,
    instructor,
  } = test;

  const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.beginner;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onSelect && onSelect(test)}
      className="group relative bg-slate-50/90 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 border border-slate-200/90 dark:border-slate-800/80 hover:border-[#04AA6D]/50 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-none cursor-pointer overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity bg-[#04AA6D]" />

      <div className="flex flex-col gap-4">
        {/* Header Badges */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono border ${diffConfig.color}`}>
              {diffConfig.label}
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {technology}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isPremium && (
              <span className="flex items-center gap-1 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-amber-300" />
                PRO
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark && onBookmark(test);
              }}
              className={`p-1.5 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-[#04AA6D] text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-200 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700/80'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors line-clamp-1 leading-snug">
            {title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
            {description || 'Evaluate real-world programming skills, algorithmic complexity, and problem solving under timed exam conditions.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-white dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-slate-400 text-[9px] uppercase">Duration</span>
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#04AA6D]" />
              {duration}m
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5 border-x border-slate-200 dark:border-slate-800 px-1">
            <span className="text-slate-400 text-[9px] uppercase">Questions</span>
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-blue-500" />
              {totalQuestions}
            </span>
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-slate-400 text-[9px] uppercase">Passing</span>
            <span className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-500" />
              {passingMarks}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="text-slate-500 dark:text-slate-400">
          {attemptCount} Attempts
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart && onStart(test);
          }}
          className="px-4 py-2 rounded-xl font-extrabold text-xs bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Take Test
        </button>
      </div>
    </motion.div>
  );
};
export default TestCard;
