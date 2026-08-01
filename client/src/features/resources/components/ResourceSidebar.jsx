import React from 'react';
import {
  Compass, Flame, Layers, Bookmark, Download, History, FolderPlus, RotateCcw, Filter,
  Code, Video, FileText, BookOpen, Trophy, Sparkles, Terminal, Cpu, ShieldCheck, Globe
} from 'lucide-react';

const NAV_TABS = [
  { id: 'explore', label: 'Explore Library', icon: Compass },
  { id: 'trending', label: 'Trending Knowledge', icon: Flame },
  { id: 'collections', label: 'Playlists & Kits', icon: FolderPlus },
  { id: 'bookmarks', label: 'My Bookmarks', icon: Bookmark },
  { id: 'history', label: 'Recently Viewed', icon: History },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'fullstack', label: 'Full Stack & Web Dev', icon: Code },
  { id: 'dsa', label: 'DSA & Algorithms', icon: Terminal },
  { id: 'ai', label: 'AI, ML & Data Science', icon: Sparkles },
  { id: 'system_design', label: 'System Design', icon: Cpu },
  { id: 'cloud', label: 'Cloud & DevOps', icon: Globe },
  { id: 'cybersecurity', label: 'Cyber Security', icon: ShieldCheck },
  { id: 'placements', label: 'Interview & Placement', icon: Trophy },
  { id: 'presentation', label: 'PowerPoint & Presentations', icon: FileText },
  { id: 'word_docs', label: 'Word Documents & Reports', icon: FileText },
];

const RESOURCE_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'pdf', label: 'PDF Notes' },
  { id: 'ppt', label: 'PowerPoint (.ppt)' },
  { id: 'word', label: 'Word Document (.doc)' },
  { id: 'source_code', label: 'Code & Starters' },
  { id: 'notes', label: 'Cheat Sheets' },
  { id: 'video', label: 'Video Tutorials' },
  { id: 'documentation', label: 'Docs & API' },
  { id: 'zip', label: 'ZIP Archives' },
];

export const ResourceSidebar = ({
  activeTab,
  activeCategory,
  activeResourceType,
  activeDifficulty,
  priceFilter,
  onTabChange,
  onCategoryChange,
  onTypeChange,
  onDifficultyChange,
  onPriceChange,
  onReset
}) => {
  return (
    <div className="w-full lg:w-72 bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-6 font-sans shrink-0 shadow-sm">
      {/* Header & Reset */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#04AA6D]" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Knowledge Hub</span>
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
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono mb-1">Categories</span>
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

      {/* Resource Types Segment */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Resource Format</span>
        <div className="flex flex-col gap-1">
          {RESOURCE_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                activeResourceType === t.id
                  ? 'text-[#04AA6D] dark:text-emerald-400 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Difficulty</span>
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
export default ResourceSidebar;
