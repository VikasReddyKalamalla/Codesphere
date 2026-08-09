import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, UploadCloud, Code, FileText, Link as LinkIcon, Plus, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateResourceModal = ({ onClose, onSubmit }) => {
  const [resourceType, setResourceType] = useState('pdf');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fullstack',
    subCategory: 'React 19',
    difficulty: 'beginner',
    tags: 'react, javascript, fullstack',
    language: 'English',
    externalUrl: '',
    codeContent: '// Enter your code snippet or template here...',
    codeLanguage: 'javascript',
    markdownContent: '# Developer Notes & Guidelines\n\nWrite detailed instructions or notes here.',
    instructor: 'CodeSphere Partner',
    isPremium: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);

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
      return toast.error('Resource title is required');
    }

    if (['pdf', 'notes', 'other'].includes(resourceType) && !selectedFile && !formData.externalUrl) {
      return toast.error('Please upload a file or provide an external URL for this resource');
    }

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('description', formData.description.trim());
    payload.append('category', formData.category);
    payload.append('difficulty', formData.difficulty);
    payload.append('resourceType', resourceType);
    payload.append('language', formData.language);
    payload.append('isPremium', formData.isPremium);
    
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      tagsArray.forEach(t => payload.append('tags[]', t));
    }
    if (formData.externalUrl) payload.append('externalUrl', formData.externalUrl);
    if (formData.codeContent) payload.append('codeContent', formData.codeContent);
    if (formData.codeLanguage) payload.append('codeLanguage', formData.codeLanguage);
    if (formData.markdownContent) payload.append('markdownContent', formData.markdownContent);

    if (selectedFile) {
      payload.append('file', selectedFile);
    }

    onSubmit && onSubmit(payload);
    toast.success('Programming resource published to CodeSphere Library!');
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
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Publish Developer Resource</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-100/50 dark:bg-slate-950/40 shrink-0 gap-2 p-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'pdf', label: 'PDF / Document', icon: FileText },
              { id: 'source_code', label: 'Code Snippet', icon: Code },
              { id: 'notes', label: 'Cheat Sheet / Notes', icon: Layers },
              { id: 'video', label: 'Video / YouTube Link', icon: LinkIcon },
              { id: 'github', label: 'GitHub Repository', icon: LinkIcon },
            ].map(t => {
              const Icon = t.icon;
              const active = resourceType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setResourceType(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#04AA6D] text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Resource Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Masterclass Zod & React Hook Form Cheat Sheet"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                >
                  <option value="fullstack">Full Stack & Web Dev</option>
                  <option value="dsa">DSA & Algorithms</option>
                  <option value="ai">AI & Machine Learning</option>
                  <option value="system_design">System Design</option>
                  <option value="cloud">Cloud & DevOps</option>
                  <option value="placements">Interview Prep</option>
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
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  placeholder="react, zod, validation"
                  value={formData.tags}
                  onChange={handleChange}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Description & Syllabus Summary</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Explain what learners will gain from this programming resource..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
              />
            </div>

            {/* Dynamic Content Inputs according to Resource Type */}
            {resourceType === 'source_code' && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 font-mono">Source Code Content</label>
                <textarea
                  name="codeContent"
                  rows={6}
                  value={formData.codeContent}
                  onChange={handleChange}
                  className="w-full bg-slate-900 text-emerald-400 font-mono border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            )}

            {(resourceType === 'video' || resourceType === 'github') && (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">External URL / Repository Link</label>
                <input
                  type="url"
                  name="externalUrl"
                  placeholder={resourceType === 'github' ? 'https://github.com/user/repo' : 'https://youtube.com/watch?v=...'}
                  value={formData.externalUrl}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#04AA6D]"
                />
              </div>
            )}

            {['pdf', 'notes', 'video', 'other'].includes(resourceType) && (
              <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl flex flex-col items-center gap-2 text-center bg-slate-50/50 dark:bg-slate-900/30 relative overflow-hidden group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.mp4"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <UploadCloud className="w-8 h-8 text-[#04AA6D] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {selectedFile ? selectedFile.name : 'Drag & drop file or click to upload'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Supports PDF, DOCX, XLSX, ZIP, MP4 up to 100MB</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleChange}
                className="w-4 h-4 accent-[#04AA6D] rounded"
              />
              <label htmlFor="isPremium" className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Mark as Exclusive / Premium Content
              </label>
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
                Publish Resource
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CreateResourceModal;
