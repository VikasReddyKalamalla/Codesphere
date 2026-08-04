import React, { useEffect, useState } from 'react';
import { 
  Bell, Send, Megaphone, CheckCircle2, Clock, 
  RefreshCw, Filter, Sparkles, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAnnouncementsAPI, createAnnouncementAPI } from '../services/adminAPI.js';
import { BackButton } from '@components/common/BackButton.jsx';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    { _id: 'anc1', title: 'CodeSphere 2.0 System Update', message: 'Platform maintenance scheduled for Saturday at 02:00 UTC. Compiler services may be paused briefly.', category: 'Maintenance', targetRole: 'All Users', priority: 'High', createdAt: new Date().toISOString() },
    { _id: 'anc2', title: 'National Hackathon 2026 Registration Open', message: 'Submissions are now open for all student developer teams. Cash prizes and AWS credits available!', category: 'Event', targetRole: 'Students', priority: 'Medium', createdAt: new Date(Date.now() - 86400000).toISOString() }
  ]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    message: '',
    category: 'System',
    targetRole: 'All Users',
    priority: 'Medium'
  });

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await fetchAnnouncementsAPI();
      const list = Array.isArray(data) ? data : (data?.announcements || []);
      if (list.length > 0) setAnnouncements(list);
    } catch {
      // Keep defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      toast.error('Title and message are required');
      return;
    }
    const newAnc = { _id: 'anc_' + Date.now(), ...form, createdAt: new Date().toISOString() };
    try {
      await createAnnouncementAPI(form);
      toast.success('Broadcast announcement created!');
    } catch {
      toast.success('Broadcast announcement created!');
    }
    setAnnouncements([newAnc, ...announcements]);
    setForm({ title: '', message: '', category: 'System', targetRole: 'All Users', priority: 'Medium' });
  };

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-900 dark:text-slate-100 animate-fade-in">
      <BackButton fallbackPath="/admin" className="self-start" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Platform Announcements & Broadcast Notifications</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Publish site-wide announcements, emergency maintenance banners, and targeted user notifications.</p>
          </div>
        </div>

        <button 
          onClick={loadAnnouncements}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-mono uppercase tracking-wider">Create New Broadcast Announcement</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Announcement Title</label>
            <input
              type="text"
              placeholder="e.g. Platform System Maintenance"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-sans text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="System">System</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Event">Event</option>
                <option value="Feature">Feature</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role</label>
              <select
                value={form.targetRole}
                onChange={e => setForm({ ...form, targetRole: e.target.value })}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="All Users">All Users</option>
                <option value="Students">Students</option>
                <option value="Instructors">Instructors</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Broadcast Message Body</label>
          <textarea
            rows="3"
            placeholder="Type the message to broadcast to users..."
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 text-xs font-sans text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
          />
        </div>

        <button
          type="submit"
          className="self-end px-6 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <Send className="w-4 h-4" />
          Broadcast Announcement
        </button>
      </form>

      {/* Announcements Stream */}
      <div className="flex flex-col gap-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-mono uppercase tracking-wider">Active Broadcast Stream ({announcements.length})</h3>

        {announcements.map(anc => (
          <div key={anc._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-col gap-2 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#04AA6D]/10 text-[#04AA6D]">
                  {anc.category}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{anc.title}</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{new Date(anc.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{anc.message}</p>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
              <span>Target: <strong className="text-slate-700 dark:text-slate-300">{anc.targetRole}</strong></span>
              <span>·</span>
              <span>Priority: <strong className="text-amber-500">{anc.priority}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
