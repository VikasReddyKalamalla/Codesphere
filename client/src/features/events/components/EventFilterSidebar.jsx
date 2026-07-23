import React from 'react';
import { Filter, RotateCcw, Flame, Sparkles, MapPin, Globe, Laptop, Building2, Layers, DollarSign, Award } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Layers },
  { id: 'hackathon', label: 'Hackathons', icon: Flame },
  { id: 'ai_conference', label: 'AI & Machine Learning', icon: Sparkles },
  { id: 'coding_contest', label: 'Coding Contests', icon: Award },
  { id: 'cloud_summit', label: 'Cloud Summits', icon: Globe },
  { id: 'cybersecurity_conf', label: 'Cybersecurity', icon: Building2 },
  { id: 'blockchain_event', label: 'Web3 & Blockchain', icon: Layers },
  { id: 'gamedev_event', label: 'GameDev & WebGPU', icon: Laptop },
  { id: 'workshop', label: 'Workshops & Webinars', icon: Laptop },
  { id: 'meetup', label: 'Developer Meetups', icon: MapPin },
];

export const EventFilterSidebar = ({
  selectedEventType,
  selectedMode,
  selectedDifficulty,
  priceFilter,
  searchQuery,
  onTypeChange,
  onModeChange,
  onDifficultyChange,
  onPriceChange,
  onSearchChange,
  onReset
}) => {
  return (
    <div className="w-full lg:w-72 bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col gap-6 font-sans shrink-0 shadow-sm">
      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#04AA6D]" />
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] text-[#04AA6D] hover:text-emerald-600 dark:hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Event Categories */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Category</span>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = selectedEventType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onTypeChange(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  active
                    ? 'bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#04AA6D]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Filter */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Event Mode</span>
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-xl border border-slate-300/60 dark:border-slate-800">
          {['all', 'online', 'offline', 'hybrid'].map(mode => (
            <button
              key={mode}
              onClick={() => onModeChange(mode)}
              className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all capitalize cursor-pointer font-mono ${
                selectedMode === mode
                  ? 'bg-[#04AA6D] text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Entry Fee</span>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-xl border border-slate-300/60 dark:border-slate-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'free', label: 'Free' },
            { id: 'paid', label: 'Paid' },
          ].map(pf => (
            <button
              key={pf.id}
              onClick={() => onPriceChange(pf.id)}
              className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer font-mono ${
                priceFilter === pf.id
                  ? 'bg-[#04AA6D] text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {pf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Target Level</span>
        <div className="flex flex-col gap-1">
          {['all', 'beginner', 'intermediate', 'advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? 'text-[#04AA6D] dark:text-emerald-400 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default EventFilterSidebar;
