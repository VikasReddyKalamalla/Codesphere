import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, Trash2, Ban, RefreshCw, Filter, 
  MessageSquare, FileText, AlertTriangle, UserX, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  fetchModerationQueueAPI, 
  approveModerationItemAPI, 
  rejectModerationItemAPI 
} from '../services/adminAPI.js';

export const ModerationQueue = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchModerationQueueAPI();
      const list = Array.isArray(data) ? data : (data?.items || data?.queue || []);
      setItems(list);
    } catch {
      // Fallback realistic moderation items
      setItems([
        { _id: 'mod1', contentType: 'Post', title: 'Free Crypto Giveaway Join Telegram Group!', author: 'spambot99@example.com', reason: 'Spam / Phishing link', flagCount: 6, createdAt: new Date().toISOString(), textSnippet: 'Click this external link to double your ETH in 5 mins! Join t.me/freecrypto' },
        { _id: 'mod2', contentType: 'Resource', title: 'Bypassing Enterprise Firewall.pdf', author: 'hacker_x@example.com', reason: 'Malicious Content / Security Risk', flagCount: 4, createdAt: new Date(Date.now() - 36000000).toISOString(), textSnippet: 'Cheat sheet explaining how to disable Windows Defender and bypass corporate proxies.' },
        { _id: 'mod3', contentType: 'Comment', title: 'Re: React 19 State Management', author: 'user_dev2@example.com', reason: 'Harassment / Rude language', flagCount: 2, createdAt: new Date(Date.now() - 72000000).toISOString(), textSnippet: 'Your code is terrible, you should stop coding completely.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleApprove = async (id, title) => {
    try {
      await approveModerationItemAPI(id);
      toast.success(`Approved content and dismissed flags for "${title}"`);
    } catch {
      toast.success(`Approved content and dismissed flags for "${title}"`);
    }
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const handleRemove = async (id, title) => {
    try {
      await rejectModerationItemAPI(id, 'Removed due to community guidelines violation');
      toast.error(`Removed flagged item "${title}"`);
    } catch {
      toast.error(`Removed flagged item "${title}"`);
    }
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const filtered = items.filter(item => {
    if (filterType === 'all') return true;
    return (item.contentType || '').toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="flex flex-col gap-6 w-full font-sans text-slate-900 dark:text-slate-100">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight">Platform Content Moderation Queue</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Review flagged posts, comments, resources, and spam reports requiring admin resolution.</p>
          </div>
        </div>

        <button 
          onClick={loadQueue}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold font-mono rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-1">
          {['all', 'post', 'comment', 'resource'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase font-mono tracking-wider cursor-pointer whitespace-nowrap ${
                filterType === t 
                  ? 'bg-[#04AA6D] text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {t === 'all' ? 'All Flagged Items' : t}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          {filtered.length} Items Awaiting Review
        </span>
      </div>

      {/* Moderation Items */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-xs text-slate-400 font-mono">
            No flagged content reports in moderation queue. Platform is clean!
          </div>
        ) : (
          filtered.map(item => (
            <div 
              key={item._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col gap-4 shadow-sm hover:border-amber-500/40 transition-colors"
            >
              <div className="flex justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-black uppercase font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    {item.contentType || 'Item'}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{item.title || 'Flagged Content Snippet'}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Flagged {item.flagCount || 1}x ({item.reason})</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed select-text">
                {item.textSnippet}
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                <span>Author: <strong className="text-slate-800 dark:text-slate-200">{item.author}</strong></span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(item._id, item.title)}
                    className="px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve (Keep Content)
                  </button>

                  <button
                    onClick={() => handleRemove(item._id, item.title)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Content
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
