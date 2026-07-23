import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Calendar, Trophy, Globe, Building, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateEventModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'hackathon',
    mode: 'online',
    categoryName: 'Hackathon & AI',
    categoryColor: '#04AA6D',
    country: 'United States',
    city: 'San Francisco, CA',
    venue: 'Virtual & On-site',
    latitude: 37.7749,
    longitude: -122.4194,
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
    registrationDeadline: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    maxParticipants: 1000,
    prizePool: '$10,000 USD',
    bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200',
    tags: 'react, ai, cloud, hackathon',
    companyName: 'CodeSphere Partner',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      maxParticipants: Number(formData.maxParticipants),
    };

    onSubmit && onSubmit(payload);
    toast.success('Event published successfully to CodeSphere!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#04AA6D]" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Publish New Global Event</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Event Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g., Global Generative AI Hackathon 2026"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="ai_conference">AI Conference</option>
                  <option value="coding_contest">Coding Contest</option>
                  <option value="cloud_summit">Cloud Summit</option>
                  <option value="cybersecurity_conf">Cybersecurity</option>
                  <option value="blockchain_event">Web3 & Blockchain</option>
                  <option value="workshop">Workshop</option>
                  <option value="meetup">Meetup</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Event Mode</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                >
                  <option value="online">Online</option>
                  <option value="offline">In-Person (Offline)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Prize Pool / Rewards</label>
                <input
                  type="text"
                  name="prizePool"
                  placeholder="e.g., $10,000 USD"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Description & Details</label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the problem statements, tracks, registration process, and guidelines..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Latitude (-90 to 90)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D] font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Longitude (-180 to 180)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D] font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-[#04AA6D] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-900/30 border border-emerald-400/30 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Publish to Live Platform
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CreateEventModal;
