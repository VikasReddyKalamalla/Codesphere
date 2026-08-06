import React from 'react';
import {
  Compass, Flame, Layers, Bookmark, History, RotateCcw, Filter, Trophy, Sparkles,
  Code, Terminal, Cpu, Globe, ShieldCheck, Award
} from 'lucide-react';

const NAV_TABS = [
  { id: 'explore', label: 'All Assessments', icon: Compass },
  { id: 'contests', label: 'Live Coding Contests', icon: Flame },
  { id: 'practice', label: 'Practice Problem Sets', icon: Terminal },
  { id: 'attempts', label: 'My Attempt History', icon: History },
  { id: 'bookmarks', label: 'Saved Tests', icon: Bookmark },
  { id: 'leaderboard', label: 'Global Rank Leaderboard', icon: Trophy },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'dsa', label: 'DSA & Competitive Coding', icon: Terminal },
  { id: 'fullstack', label: 'Full Stack & Web Dev', icon: Code },
  { id: 'system_design', label: 'System Design Architecture', icon: Cpu },
  { id: 'sql', label: 'Database & SQL Queries', icon: Layers },
  { id: 'ai', label: 'AI & Machine Learning', icon: Sparkles },
  { id: 'devops', label: 'Cloud & DevOps', icon: Globe },
  { id: 'cybersecurity', label: 'Cyber Security', icon: ShieldCheck },
];

export const TestSidebar = ({
  activeTab,
  activeCategory,
  activeDifficulty,
  onTabChange,
  onCategoryChange,
  onDifficultyChange,
  onReset
}) => {
  return (
    <div className="w-full lg:w-64 bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-4 sm:p-5 backdrop-blur-md flex flex-col gap-5 font-sans shrink-0 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#04AA6D]" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Assessment Hub</span>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] text-[#04AA6D] hover:text-emerald-600 dark:hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Main Nav Tabs */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono mb-1">Navigation</span>
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                active
                  ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-1 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono mb-1">Skill Tracks</span>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                active
                  ? 'bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#04AA6D]' : 'text-slate-400'}`} />
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Difficulty Level */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Difficulty Level</span>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-xl border border-slate-300/60 dark:border-slate-800">
          {['all', 'beginner', 'intermediate', 'advanced'].map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`py-1.5 text-[9px] font-bold uppercase rounded-lg transition-all capitalize cursor-pointer font-mono ${
                activeDifficulty === diff
                  ? 'bg-[#04AA6D] text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {diff === 'intermediate' ? 'Inter' : diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default TestSidebar;
