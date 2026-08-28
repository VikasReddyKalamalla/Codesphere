import React, { useState, useEffect } from 'react';
import { BackButton } from '@components/common/BackButton.jsx';
import { Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '@services/axios.js';

export const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/events/registrations');
      const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.registrations || []);
      setEvents(list);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      <BackButton fallbackPath="/events" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">My Registered Events</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hackathons, coding contests, and live workshops you have enrolled in.</p>
        </div>
        <button
          onClick={fetchRegistrations}
          disabled={loading}
          className="p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-orange-500" />
          <span className="text-xs text-slate-400 font-mono">Fetching event registrations...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-400 font-mono">
          You haven't registered for any events yet. Explore upcoming hackathons on the Events page!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e, idx) => (
            <div key={e._id || idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Registered
                </span>
                <span className="text-[10px] font-mono text-slate-400">{e.eventDate ? new Date(e.eventDate).toLocaleDateString() : 'Upcoming'}</span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{e.event?.title || e.title || 'Platform Event'}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegisteredEvents;
