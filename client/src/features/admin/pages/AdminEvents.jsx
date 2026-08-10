import React, { useEffect, useState } from 'react';
import apiClient from '@services/axios.js';
import toast from 'react-hot-toast';
import { Calendar, Plus, Trash2, Video, Users, CheckCircle2, Clock } from 'lucide-react';
import { BackButton } from '@components/common/BackButton.jsx';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'webcast',
    startDate: '',
    meetingUrl: '',
  });

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get('/events');
      const data = res.data?.data?.events || res.data?.events || res.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error('Event title is required');

    try {
      await apiClient.post('/events', formData);
      toast.success('Event scheduled successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', description: '', eventType: 'webcast', startDate: '', meetingUrl: '' });
      fetchEvents();
    } catch (err) {
      toast.error('Failed to schedule event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;
    try {
      await apiClient.delete(`/events/${id}`);
      toast.success('Event cancelled successfully');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to cancel event');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      <BackButton fallbackPath="/admin" />

      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-500" />
            Events & Hackathon Scheduler
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Schedule live workshops, campus hackathons, and technical webcasts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 text-xs flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Schedule Event / Hackathon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-6">No scheduled events found.</p>
          ) : (
            events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                      {ev.eventType || 'Event'}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Cancel Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">{ev.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{ev.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{ev.startDate ? new Date(ev.startDate).toLocaleDateString() : 'Upcoming'}</span>
                  </div>

                  {ev.meetingUrl && (
                    <a
                      href={ev.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-500 hover:underline flex items-center gap-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Meet Link</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Schedule Event / Hackathon</h3>
            <form onSubmit={handleCreateEvent} className="flex flex-col gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Event Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              >
                <option value="webcast">Live Webcast</option>
                <option value="hackathon">Campus Hackathon</option>
                <option value="workshop">Interactive Workshop</option>
                <option value="qa">Live Q&A Session</option>
              </select>
              <input
                type="text"
                placeholder="Meeting Link (Google Meet / Zoom)"
                value={formData.meetingUrl}
                onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <textarea
                rows={3}
                placeholder="Event Description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#04AA6D] text-white font-bold shadow-md"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminEvents;
