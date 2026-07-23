import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Save, ShieldAlert } from 'lucide-react';
import { 
  fetchCommunityDetailsThunk, 
  updateCommunityThunk 
} from '../redux/communityThunk.js';
import { selectActiveCommunity } from '../redux/communitySelectors.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import toast from 'react-hot-toast';

export const CommunitySettings = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const community = useSelector(selectActiveCommunity);
  const currentUser = useSelector(selectCurrentUser);

  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');

  const isOwner = community?.owner?._id === currentUser?._id || community?.owner === currentUser?._id;
  const isModerator = community?.moderators?.some(m => m === currentUser?._id || m._id === currentUser?._id);
  const hasAccess = isOwner || isModerator;

  useEffect(() => {
    if (communityId) {
      dispatch(fetchCommunityDetailsThunk(communityId));
    }
  }, [communityId, dispatch]);

  useEffect(() => {
    if (community) {
      setDescription(community.description || '');
      setRules(community.rules || '');
      setLogo(community.logo || '');
      setBanner(community.banner || '');
      setVisibility(community.visibility || 'public');
      setCategory(community.category || 'General');
      setTags(community.tags?.join(', ') || '');
    }
  }, [community]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasAccess) {
      toast.error('You do not have administrative access');
      return;
    }

    const formattedTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const payload = {
      description,
      rules,
      logo,
      banner,
      visibility,
      category,
      tags: formattedTags
    };

    dispatch(updateCommunityThunk(communityId, payload, () => {
      navigate(`/community/${communityId}`);
    }));
  };

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-slate-500 font-mono text-[10px] uppercase bg-slate-550/5 dark:bg-[#080d1a]">
        Loading configurations...
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center gap-2 bg-slate-550/5 dark:bg-[#080d1a]">
        <ShieldAlert size={28} className="text-red-500" />
        <span className="text-[10px] text-red-500 font-mono font-bold uppercase tracking-wider">Access Denied</span>
        <p className="text-xs text-slate-500 max-w-sm mt-1">Only community owners or moderators can change settings.</p>
        <button 
          onClick={() => navigate(`/community/${communityId}`)}
          className="mt-4 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1.5"
        >
          <ArrowLeft size={12} />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 font-sans text-left select-none min-h-[calc(100vh-64px)] flex flex-col justify-center bg-slate-550/5 dark:bg-[#080d1a]">
      
      {/* Back button */}
      <button 
        onClick={() => navigate(`/community/${communityId}`)}
        className="flex items-center gap-2 text-xs font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider font-mono mb-6 self-start"
      >
        <ArrowLeft size={12} />
        <span>Return to Space</span>
      </button>

      {/* Settings Form Card */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-805 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2.5 mb-6 border-b border-slate-150 dark:border-slate-850 pb-5">
          <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div className="text-left">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Guild Settings</h3>
            <p className="text-[11px] text-slate-500 mt-1">Configure metadata details for "{community.name}"</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4.5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Category Area</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-550/5 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-500 cursor-pointer font-semibold"
              >
                <option value="General">General</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming Languages">Programming Languages</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Visibility Mode</label>
              <select 
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="bg-slate-550/5 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-500 cursor-pointer font-semibold"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Overview Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-550 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Logo Link */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Logo Image URL</label>
              <input 
                type="text" 
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-550"
              />
            </div>

            {/* Banner Link */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Banner Cover URL</label>
              <input 
                type="text" 
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-550"
              />
            </div>
          </div>

          {/* Rules and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Rules</label>
              <textarea 
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={3}
                className="w-full bg-slate-550/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-550 resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-wider font-mono">Search Tags (Comma-separated)</label>
              <textarea 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                rows={3}
                className="w-full bg-slate-555/5 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-150 focus:border-indigo-550 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3.5 pt-5 border-t border-slate-150 dark:border-slate-850">
            <button 
              type="button"
              onClick={() => navigate(`/community/${communityId}`)}
              className="text-xs font-bold font-mono uppercase tracking-wide text-slate-455 hover:text-slate-800 dark:hover:text-white px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono uppercase tracking-wide px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-500/10"
            >
              <span>Save Configurations</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default CommunitySettings;
