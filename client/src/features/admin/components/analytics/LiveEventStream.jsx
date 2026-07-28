import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  DollarSign, 
  UserPlus, 
  Code, 
  CheckCircle, 
  Video, 
  AlertTriangle, 
  Clock,
  Sparkles
} from 'lucide-react';

export const LiveEventStream = ({ events = [], onSimulate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'payment', label: 'Payments' },
    { id: 'user', label: 'Users' },
    { id: 'test', label: 'Assessments' },
    { id: 'codex', label: 'Codex Workspaces' },
    { id: 'session', label: 'Live Sessions' },
    { id: 'system', label: 'System Alerts' },
  ];

  const getEventIcon = (category) => {
    switch (category) {
      case 'payment':
        return { icon: DollarSign, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' };
      case 'user':
        return { icon: UserPlus, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
      case 'test':
        return { icon: CheckCircle, color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30' };
      case 'codex':
        return { icon: Code, color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30' };
      case 'session':
        return { icon: Video, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30' };
      case 'system':
        return { icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
      default:
        return { icon: Radio, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
      case 'error':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      ev.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (id) => {
    const found = categories.find((c) => c.id === id);
    return found ? found.label : 'Event';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            Live Platform Audit Stream & Activity Ticker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Real-time event log feed emitting directly over Socket.IO
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event feed..."
              className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <button
            onClick={() => onSimulate && onSimulate(selectedCategory)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            title={`Trigger real MongoDB event for ${getCategoryLabel(selectedCategory)}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            + Trigger {selectedCategory === 'all' ? 'Event' : getCategoryLabel(selectedCategory)}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all' ? events.length : events.filter((e) => e.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                isSelected ? 'bg-emerald-700/60 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event Stream List Container */}
      <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-mono flex flex-col items-center justify-center gap-2">
            <p>No real-time database events recorded for "{getCategoryLabel(selectedCategory)}".</p>
            <button
              onClick={() => onSimulate && onSimulate(selectedCategory)}
              className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 transition-all"
            >
              + Trigger First {getCategoryLabel(selectedCategory)} Event to Database
            </button>
          </div>
        ) : (
          filteredEvents.map((item, idx) => {
            const { icon: EventIcon, color: iconStyle } = getEventIcon(item.category);
            const statusStyle = getStatusStyle(item.status);
            const timeStr = item.timestamp
              ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : 'Just now';

            return (
              <div
                key={item._id || idx}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${iconStyle}`}>
                    <EventIcon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </span>
                      {item.amount > 0 && (
                        <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30 px-2 py-0.5 rounded-full">
                          +${item.amount.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 justify-end">
                      <span>{item.userName}</span>
                      {item.country && (
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.country}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {timeStr}
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyle}`}>
                    {item.status || 'INFO'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
