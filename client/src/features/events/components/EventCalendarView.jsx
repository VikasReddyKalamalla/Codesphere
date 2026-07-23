import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Trophy, Download, Flame, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const EventCalendarView = ({ events = [], onSelectEvent }) => {
  const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming', 'monthly'

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const getDaysRemaining = (targetDate) => {
    const diff = new Date(targetDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} Days Left` : 'Event Live / Starting Soon';
  };

  return (
    <div className="w-full bg-slate-50/90 dark:bg-slate-900/50 border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#04AA6D]" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Event Timeline & Schedule</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Chronological schedule of global coding hackathons, summits & webcasts</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
              viewMode === 'upcoming'
                ? 'bg-[#04AA6D] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Timeline Stream
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative flex flex-col gap-6 pl-4 md:pl-8 border-l-2 border-slate-200 dark:border-slate-800">
        {sortedEvents.map((ev, index) => {
          const isFeatured = ev.isFeatured;
          return (
            <div key={ev._id || index} className="relative group">
              {/* Timeline Marker Point */}
              <div className="absolute -left-[25px] md:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-[#04AA6D] group-hover:bg-[#04AA6D] group-hover:scale-125 transition-all shadow-md" />

              <div
                onClick={() => onSelectEvent && onSelectEvent(ev)}
                className="bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 p-5 rounded-2xl transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group-hover:shadow-lg"
              >
                <div className="flex flex-col gap-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-300 border border-[#04AA6D]/30">
                      {ev.eventType || 'Hackathon'}
                    </span>
                    <span className="text-[10px] font-mono text-[#04AA6D] dark:text-emerald-400 font-bold">
                      {getDaysRemaining(ev.startDate)}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors">
                    {ev.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 font-sans">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>{new Date(ev.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#04AA6D]" />
                      <span>{ev.city || 'Remote'}, {ev.country || 'Global'}</span>
                    </div>

                    {ev.prizePool && (
                      <div className="flex items-center gap-1 text-[#04AA6D] dark:text-emerald-400 font-bold font-mono">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{ev.prizePool}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button className="px-4 py-2 bg-[#04AA6D]/15 group-hover:bg-[#04AA6D] text-[#04AA6D] group-hover:text-white border border-[#04AA6D]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1">
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default EventCalendarView;
