import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Clock, HelpCircle, Award, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateTestModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'dsa',
    technology: 'React & Node.js',
    difficulty: 'beginner',
    duration: 45,
    totalQuestions: 10,
    passingMarks: 60,
    totalMarks: 100,
    negativeMarking: false,
    isPremium: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error('Assessment title is required');
    }

    onSubmit && onSubmit(formData);
    toast.success('Coding Assessment created & published successfully!');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#04AA6D]" />
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Create Coding Assessment</h2>
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
              <label className="font-bold text-slate-700 dark:text-slate-300">Assessment Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Masterclass Data Structures & Dynamic Programming Exam"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Skill Track</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                >
                  <option value="dsa">DSA & Algorithms</option>
                  <option value="fullstack">Full Stack & Web Dev</option>
                  <option value="system_design">System Design</option>
                  <option value="sql">Database & SQL</option>
                  <option value="ai">AI & Machine Learning</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Technology Tag</label>
                <input
                  type="text"
                  name="technology"
                  placeholder="React, C++, Python"
                  value={formData.technology}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Duration (Minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Total Questions</label>
                <input
                  type="number"
                  name="totalQuestions"
                  value={formData.totalQuestions}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Passing Score (%)</label>
                <input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Instructions & Syllabus</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Detail assessment rules, time limit constraints, and syllabus topics..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
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
                className="px-6 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400/30 cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create & Publish Assessment
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CreateTestModal;
