import React, { useState } from 'react';
import { 
  Send, 
  Image, 
  Pin, 
  Sparkles, 
  ShieldAlert, 
  Megaphone, 
  Rocket, 
  Wrench, 
  Users,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AnnouncementComposer = ({ onPostAnnouncement, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Update');
  const [priority, setPriority] = useState('Medium');
  const [targetAudience, setTargetAudience] = useState('All');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const categories = [
    { id: 'Update', label: 'System Update', icon: Megaphone, color: 'text-indigo-600 dark:text-indigo-400' },
    { id: 'Release', label: 'Feature Release', icon: Rocket, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'Maintenance', label: 'Maintenance', icon: Wrench, color: 'text-amber-600 dark:text-amber-400' },
    { id: 'Community', label: 'Community Event', icon: Users, color: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'Security', label: 'Security Alert', icon: ShieldAlert, color: 'text-rose-600 dark:text-rose-400' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter both a title and message for your announcement');
      return;
    }

    onPostAnnouncement({
      title: title.trim(),
      message: message.trim(),
      category,
      priority,
      targetAudience,
      mediaUrl: mediaUrl.trim(),
      isPinned,
    });

    // Reset form
    setTitle('');
    setMessage('');
    setMediaUrl('');
    setIsPinned(false);
    setShowImageInput(false);
  };

  const charCount = message.length;
  const maxChar = 1000;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-500/20">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">CodeSphere Team</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <Check className="w-2.5 h-2.5 stroke-[3]" /> Official Broadcast
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">@CodeSphereAdmin</p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {charCount}/{maxChar} chars
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Announcement Headline Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement Title / Headline (e.g. CodeSphere v2.4 Release)..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          maxLength={180}
          required
        />

        {/* Message Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's happening across CodeSphere? Type announcement details, features, or alerts..."
          rows={4}
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 resize-none font-sans leading-relaxed transition-all"
          maxLength={maxChar}
          required
        />

        {/* Media URL optional input */}
        {showImageInput && (
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste Image / Banner URL (e.g. https://images.unsplash.com/...)"
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => setShowImageInput(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase font-mono mr-1">Category:</span>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : cat.color}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Controls Toolbar: Audience, Priority, Image & Pin Toggle, Submit */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 flex-wrap text-xs">
            {/* Target Audience */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Audience:</span>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Users</option>
                <option value="Students">Students Only</option>
                <option value="Instructors">Instructors Only</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Priority:</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical Alert</option>
              </select>
            </div>

            {/* Image Toggle */}
            <button
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`p-2 rounded-lg border transition-all ${
                showImageInput || mediaUrl
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-slate-700'
              }`}
              title="Attach Banner Image URL"
            >
              <Image className="w-4 h-4" />
            </button>

            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                isPinned
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title="Pin to top of feed"
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
              {isPinned ? 'Pinned' : 'Pin Post'}
            </button>
          </div>

          {/* Submit Post Button */}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !message.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? 'Posting...' : 'Post Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
};
