import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText, Code, Video, Download, Eye, Bookmark, Star, Sparkles, Share2,
  ArrowLeft, CheckCircle2, MessageSquare, Send, Copy, ExternalLink, ShieldCheck,
  Layers, GitBranch, UserCheck, Calendar, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

import {
  fetchResourceByIdThunk
} from '../redux/resourceThunk.js';

import {
  selectSelectedResource,
  selectUserBookmarks
} from '../redux/resourceSelectors.js';

import { toggleBookmark } from '../redux/resourceSlice.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resource = useSelector(selectSelectedResource);
  const userBookmarks = useSelector(selectUserBookmarks);

  const [activeTab, setActiveTab] = useState('preview'); // preview, description, discussion, author
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { id: 1, name: 'Alex Rivera', role: 'Senior Dev', text: 'This cheat sheet and code starter saved me hours during system design review!', time: '2 hours ago' },
    { id: 2, name: 'Elena Rostova', role: 'Full Stack Student', text: 'Clean code examples and PDF notes. Highly recommended!', time: '5 hours ago' }
  ]);
  const [userRating, setUserRating] = useState(5);

  useEffect(() => {
    if (id) {
      dispatch(fetchResourceByIdThunk(id));
    }
  }, [id, dispatch]);

  const isBookmarked = userBookmarks.includes(id || resource?._id);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Source code copied to clipboard!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Resource link copied to clipboard!');
  };

  const handleDownload = () => {
    toast.success(`Downloading ${resource?.title || 'resource'}...`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      ...commentsList,
      { id: Date.now(), name: 'You', role: 'Developer', text: commentText.trim(), time: 'Just now' }
    ]);
    setCommentText('');
    toast.success('Comment posted successfully!');
  };

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-[#04AA6D] animate-spin" />
        <span>Loading Knowledge Resource Details...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 animate-fade-in">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <BackButton fallbackPath="/resources" className="self-start" />

      {/* Top Banner Header */}
      <div className="relative w-full bg-gradient-to-r from-emerald-950 via-[#0b2b1d] to-emerald-950 border border-[#04AA6D]/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#04AA6D]/20 text-emerald-300 border border-[#04AA6D]/40 font-mono">
                {resource.resourceType || 'Resource'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-mono">
                {resource.difficulty || 'Beginner'}
              </span>
              {resource.isPremium && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  PREMIUM
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {resource.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {resource.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-sans pt-1">
              <span>Author: <strong className="text-emerald-400">{resource.instructor || resource.uploadedBy?.fullName || 'CodeSphere Alliance'}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {resource.averageRating || 4.9} (128 reviews)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => dispatch(toggleBookmark(id || resource._id))}
              className={`p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isBookmarked
                  ? 'bg-[#04AA6D] border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Bookmark Resource"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Share Resource"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 border border-emerald-400/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resource
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body: Previews & Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tabs Bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 no-scrollbar overflow-x-auto">
            {[
              { id: 'preview', label: 'Interactive Preview & Code' },
              { id: 'description', label: 'Detailed Overview & Notes' },
              { id: 'discussion', label: `Community Discussion (${commentsList.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === t.id
                    ? 'border-[#04AA6D] text-[#04AA6D] dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Interactive Preview Container */}
          {activeTab === 'preview' && (
            <div className="flex flex-col gap-4">
              {resource.codeContent || resource.resourceType === 'source_code' ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-900 border-b border-slate-800 font-mono text-xs text-slate-300">
                    <span className="flex items-center gap-2 text-emerald-400 font-bold">
                      <Code className="w-4 h-4" />
                      {resource.codeLanguage || 'javascript'} snippet
                    </span>
                    <button
                      onClick={() => handleCopyCode(resource.codeContent || '// Sample code')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px]"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </button>
                  </div>
                  <pre className="p-5 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed select-text">
                    {resource.codeContent || `// CodeSphere Starter Template\nimport { useState } from 'react';\n\nexport const CodeSnippet = () => {\n  return (\n    <div className="p-4 bg-emerald-500 text-white rounded-xl">\n      <h1>CodeSphere Resource Hub</h1>\n    </div>\n  );\n};`}
                  </pre>
                </div>
              ) : resource.externalUrl ? (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 text-center">
                  <ExternalLink className="w-10 h-10 text-[#04AA6D]" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">External Link / Video Source Available</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.externalUrl}</p>
                  </div>
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    Open Link in New Tab
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3 text-center">
                  <FileText className="w-12 h-12 text-[#04AA6D]" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Document & PDF Preview Available</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Click download below to access the full PDF notes file.</p>
                </div>
              )}
            </div>
          )}

          {/* Description & Overview */}
          {activeTab === 'description' && (
            <div className="flex flex-col gap-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Detailed Knowledge Notes</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {resource.markdownContent || resource.description || 'This resource includes complete code examples, architecture diagrams, and step-by-step cheat sheets verified by CodeSphere instructors.'}
              </p>
            </div>
          )}

          {/* Discussion */}
          {activeTab === 'discussion' && (
            <div className="flex flex-col gap-6">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or leave feedback..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-[#04AA6D]"
                />
                <button type="submit" className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {commentsList.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#04AA6D]">{c.name} <span className="text-[10px] text-slate-500">({c.role})</span></span>
                      <span className="text-[9px] text-slate-500 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Info Box */}
        <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl self-start">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800 font-mono">Resource Particulars</h3>

          <div className="flex flex-col gap-3 text-xs text-slate-700 dark:text-slate-300 font-sans">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#04AA6D] shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Published Date</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(resource.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Total Views</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{resource.views || 420} views</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Total Downloads</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{resource.downloadsCount || 185} downloads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResourceDetails;
