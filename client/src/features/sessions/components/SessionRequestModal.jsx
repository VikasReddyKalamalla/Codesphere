import React, { useState } from 'react';
import { X, Calendar, Clock, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSessionRequestAPI } from '../services/sessionAPI';

export const SessionRequestModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agenda: '',
    proposedTime: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.proposedTime) {
      return toast.error('Please fill in all required fields');
    }
    
    setLoading(true);
    try {
      await createSessionRequestAPI(formData);
      toast.success('Session request submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-sans";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <Video className="w-5 h-5 text-[#04AA6D]" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Request a Live Session</h2>
            <p className="text-xs text-slate-500">Propose a Google Meet session to host for the community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Session Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Masterclass: Advanced React Patterns"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="What will you cover?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Agenda / Topics (Optional)</label>
            <textarea
              rows={2}
              value={formData.agenda}
              onChange={(e) => setFormData(p => ({ ...p, agenda: e.target.value }))}
              placeholder="- Topic 1\n- Topic 2"
              className={`${inputClass} resize-none font-mono text-xs`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Proposed Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.proposedTime}
              onChange={(e) => setFormData(p => ({ ...p, proposedTime: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
