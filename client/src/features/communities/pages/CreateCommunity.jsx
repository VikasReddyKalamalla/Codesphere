import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Globe, Lock, Sparkles, Layers, Image as ImageIcon } from 'lucide-react';
import { createCommunityThunk } from '../redux/communityThunk.js';

export const CreateCommunity = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [tags, setTags] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    const formattedTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      rules: rules.trim(),
      tags: formattedTags,
      logo: logo.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80',
      banner: banner.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=200&q=80',
      visibility,
      category
    };

    dispatch(createCommunityThunk(payload, (newId) => {
      setLoading(false);
      navigate(`/community/${newId}`);
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 font-sans select-none text-left min-h-[calc(100vh-64px)] flex flex-col justify-center bg-slate-50 dark:bg-[#080d1a]">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/community')}
        className="flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider font-mono mb-6 self-start"
      >
        <ArrowLeft size={12} />
        <span>Return to Lobby</span>
      </button>

      {/* Main card form */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-6 border-b border-slate-150 dark:border-slate-850 pb-5">
          <Sparkles className="w-5 h-5 text-indigo-550 dark:text-indigo-400 animate-pulse" />
          <div className="text-left">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Launch a new space</h3>
            <p className="text-[11px] text-slate-500 mt-1">Host developer meetups, code showcases, and live discussions.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {/* Space name */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Community Name</label>
              <input 
                type="text" 
                placeholder="e.g. React Specialists" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            {/* Category dropdown */}
            <div className="flex flex-col gap-2 text-left">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Category Area</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 focus:border-indigo-500 cursor-pointer font-semibold"
              >
                <option value="General">General</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming Languages">Programming Languages</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Overview Description</label>
            <textarea 
              placeholder="What is this community about? Describe topics, rules, and expected discussions." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            {/* Logo Link */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <ImageIcon size={10} />
                <span>Logo URL (Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="https://..." 
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>

            {/* Banner Link */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <ImageIcon size={10} />
                <span>Banner URL (Optional)</span>
              </label>
              <input 
                type="text" 
                placeholder="https://..." 
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Rules and Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Rules (Optional)</label>
              <textarea 
                placeholder="e.g. Respect other members, No spam..." 
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Search Tags (Comma-separated)</label>
              <textarea 
                placeholder="e.g. react, tailwind, typescript" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-605 focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* Visibility selection */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Visibility Mode</label>
            <div className="grid grid-cols-2 gap-3.5">
              <button 
                type="button"
                onClick={() => setVisibility('public')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  visibility === 'public' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-550 text-indigo-650 dark:text-indigo-400 shadow-sm' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-405 hover:border-slate-300 dark:hover:border-slate-800'
                }`}
              >
                <Globe className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-bold block leading-none">Public Space</span>
                  <span className="text-[9px] text-slate-455 dark:text-slate-500 mt-1 block">Anyone can discover, view feed, and join.</span>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setVisibility('private')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  visibility === 'private' 
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-550 text-indigo-655 dark:text-indigo-400 shadow-sm' 
                    : 'bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-855 text-slate-600 dark:text-slate-405 hover:border-slate-300 dark:hover:border-slate-800'
                }`}
              >
                <Lock className="w-5 h-5 shrink-0" />
                <div className="text-left">
                  <span className="text-xs font-bold block leading-none">Private Space</span>
                  <span className="text-[9px] text-slate-455 dark:text-slate-500 mt-1 block">Only invited members can view feed and chat.</span>
                </div>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3.5 pt-5 border-t border-slate-150 dark:border-slate-855 text-left">
            <button 
              type="button"
              onClick={() => navigate('/community')}
              className="text-xs font-bold font-mono uppercase tracking-wide text-slate-455 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold font-mono uppercase tracking-wide px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Creating...' : 'Initialize Guild'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default CreateCommunity;
