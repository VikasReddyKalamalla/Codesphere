import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, ArrowLeft, Send, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { createSessionAPI } from '../services/sessionAPI.js';
import toast from 'react-hot-toast';

export const CreateSession = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [difficulty, setDifficulty] = useState('beginner');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState(100);
  const [isPremium, setIsPremium] = useState(false);
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error('Title is required');
    if (!startTime || !endTime) return toast.error('Start and End times are required');

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return toast.error('End time must be after start time');
    }

    if (start < new Date()) {
      return toast.error('Session cannot be scheduled in the past');
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      maxCapacity: Number(maxCapacity),
      isPremium,
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      language,
    };

    try {
      await createSessionAPI(payload);
      toast.success('Webcast Session scheduled successfully!');
      navigate('/sessions');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to schedule session');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => navigate('/sessions')}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-wider self-start cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel & Go Back
      </button>

      <div className="max-w-2xl mx-auto w-full bg-slate-50/80 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 p-8 rounded-3xl backdrop-blur-md flex flex-col gap-6 z-10">
        
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-900">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Schedule Live Webcast</h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">CREATE CLASSROOM METADATA</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Webcast Title</label>
            <input
              type="text"
              placeholder="e.g. Building a Scalable Real-time Chat App"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Description / Syllabus</label>
            <textarea
              placeholder="Provide a breakdown of what concepts will be covered during this live coding seminar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="System Design">System Design</option>
                <option value="Data Structures">Data Structures</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none transition-all font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Technology Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. react, nodejs, socketio"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all font-sans"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Language</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-4 rounded-2xl mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Premium Webcast</span>
              <span className="text-[10px] text-slate-500 leading-tight">Restrict check-in permissions to paid subscribers only.</span>
            </div>
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-[#04AA6D] focus:ring-[#04AA6D] bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-900">
            <button
              type="button"
              onClick={() => navigate('/sessions')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 text-white transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Schedule Webcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateSession;
