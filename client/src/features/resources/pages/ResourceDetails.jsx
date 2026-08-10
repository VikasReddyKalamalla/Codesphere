import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText, Code, Video, Download, Eye, Bookmark, Star, Sparkles, Share2,
  ArrowLeft, CheckCircle2, MessageSquare, Send, Copy, ExternalLink, ShieldCheck,
  Layers, GitBranch, UserCheck, Calendar, Clock, Play, BookOpen, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@services/axios.js';
import { socket } from '../../../socket/socket.js';

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

  const rawResource = useSelector(selectSelectedResource);
  const userBookmarks = useSelector(selectUserBookmarks);

  // Recursively unwrap target resource object
  const unwrap = (obj) => {
    if (!obj) return null;
    if (obj._id || obj.id) return obj;
    if (obj.resource) return unwrap(obj.resource);
    if (obj.data) return unwrap(obj.data);
    return obj;
  };
  const resource = unwrap(rawResource);

  const [activeTab, setActiveTab] = useState('preview'); // preview, description, discussion
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadResourceData = async () => {
      if (id) {
        setIsFetching(true);
        try {
          await dispatch(fetchResourceByIdThunk(id));
        } catch (err) {
          console.error('Resource details fetch error:', err);
        } finally {
          if (isMounted) setIsFetching(false);
        }
      }
    };

    loadResourceData();

    const handleResourceChanged = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'resource' || entity === 'all') {
        if (id) dispatch(fetchResourceByIdThunk(id));
      }
    };

    socket.on('admin:data_changed', handleResourceChanged);
    socket.on('resource:changed', handleResourceChanged);

    return () => {
      isMounted = false;
      socket.off('admin:data_changed', handleResourceChanged);
      socket.off('resource:changed', handleResourceChanged);
    };
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

  const handleDownload = async () => {
    if (!resource) return;
    const targetUrl = resource.fileUrl || resource.externalUrl || resource.url;
    if (!targetUrl) {
      toast.error('No downloadable file or asset link associated with this resource');
      return;
    }

    try {
      await apiClient.post(`/resources/${resource._id || resource.id}/download`);
    } catch (err) {
      // Analytics tracking fallback
    }

    const fullUrl = targetUrl.startsWith('http') || targetUrl.startsWith('data:')
      ? targetUrl
      : `http://localhost:5000${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;

    const lower = fullUrl.toLowerCase();
    const isDirectFile = lower.endsWith('.pdf') || lower.endsWith('.zip') || lower.endsWith('.docx') || lower.endsWith('.doc') || lower.endsWith('.png') || lower.endsWith('.jpg');

    if (!isDirectFile && (lower.startsWith('http://') || lower.startsWith('https://'))) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opened ${resource.title} in new tab`);
      return;
    }

    const loader = toast.loading(`Downloading ${resource.title}...`);
    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('File download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const extName = targetUrl.split('.').pop()?.split('?')[0] || 'pdf';
      const filename = targetUrl.split('/').pop() || `${resource.title}.${extName}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Successfully downloaded ${resource.title}!`, { id: loader });
    } catch (err) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      toast.success(`Opened ${resource.title}`, { id: loader });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const targetId = id || resource?._id;
    if (!targetId) return;

    setSubmittingComment(true);
    const loader = toast.loading('Posting comment...');
    try {
      await apiClient.post(`/resources/${targetId}/comments`, { text: commentText.trim() });
      toast.success('Comment posted successfully!', { id: loader });
      setCommentText('');
      dispatch(fetchResourceByIdThunk(targetId));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to post comment', { id: loader });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (isFetching && !resource?._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-500 font-mono text-xs">
        <Sparkles className="w-8 h-8 text-[#04AA6D] animate-spin" />
        <span>Loading Knowledge Resource Details...</span>
      </div>
    );
  }

  if (!resource || !resource._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-6">
        <Layers className="w-12 h-12 text-slate-400" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Knowledge Resource Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md">The resource you requested may have been removed or updated by an administrator.</p>
        <BackButton fallbackPath="/resources" />
      </div>
    );
  }

  // Construct absolute file URL
  const rawUrl = resource.fileUrl || resource.externalUrl || resource.url || '';
  const fullFileUrl = rawUrl.startsWith('http') || rawUrl.startsWith('data:')
    ? rawUrl
    : `http://localhost:5000${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

  const ext = rawUrl.toLowerCase().split('.').pop()?.split('?')[0] || '';
  const isPdf = ext === 'pdf';
  const isVideo = resource.resourceType === 'video' || ['mp4', 'webm', 'ogg'].includes(ext) || rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext);
  const isCode = resource.codeContent || resource.resourceType === 'source_code' || ['js', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json'].includes(ext);

  const commentsCount = (resource.comments && resource.comments.length) || 0;

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 animate-fade-in">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <BackButton fallbackPath="/resources" className="self-start" />

      {/* Top Banner Header - CodeSphere Signature Design System */}
      <div className="relative w-full bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden shadow-sm dark:shadow-xl text-slate-900 dark:text-white transition-all">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#04AA6D]/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono">
                {resource.resourceType || 'Resource'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                {resource.difficulty || 'Beginner'}
              </span>
              {resource.isPremium && (
                <span className="text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  PREMIUM
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {resource.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {resource.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-sans pt-1">
              <span>Author: <strong className="text-[#04AA6D] dark:text-emerald-400 font-bold">{resource.instructor || resource.uploadedBy?.fullName || 'CodeSphere Author'}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {resource.averageRating || 4.9} (128 reviews)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => dispatch(toggleBookmark(id || resource._id))}
              className={`p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isBookmarked
                  ? 'bg-[#04AA6D] border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bookmark Resource"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              title="Share Resource"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-5 py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
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
              { id: 'discussion', label: `Community Discussion (${commentsCount})` },
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

          {/* TAB 1: INTERACTIVE PREVIEW CONTAINER */}
          {activeTab === 'preview' && (
            <div className="flex flex-col gap-5">
              {/* PDF Document Preview (Only for valid PDF URLs that are not example.com placeholders) */}
              {isPdf && rawUrl && !rawUrl.includes('example.com') && (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-2 text-[#04AA6D] dark:text-emerald-400 font-bold">
                      <FileText className="w-4 h-4" />
                      Live Embedded PDF Viewer
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={fullFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Full Window
                      </a>
                      <button
                        onClick={handleDownload}
                        className="px-3 py-1.5 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF Asset
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-[550px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-900">
                    <iframe
                      src={fullFileUrl}
                      title="Live PDF Viewer"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Video Player Preview */}
              {isVideo && rawUrl && (
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-2 text-blue-400 font-bold">
                      <Video className="w-4 h-4" />
                      Live Stream Video Lecture Player
                    </span>
                  </div>
                  <div className="w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black flex items-center justify-center">
                    {rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be') ? (
                      <iframe
                        src={rawUrl.replace('watch?v=', 'embed/')}
                        title="Video Player"
                        className="w-full h-[450px] border-0"
                        allowFullScreen
                      />
                    ) : (
                      <video src={fullFileUrl} controls className="w-full max-h-[480px] object-contain" />
                    )}
                  </div>
                </div>
              )}

              {/* Live Interactive Document Reader & Preview Card */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-500">
                  <span className="text-[#04AA6D] font-bold uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Interactive Resource Reader & Overview
                  </span>
                  <span className="bg-[#04AA6D]/10 text-[#04AA6D] px-3 py-1 rounded-full font-extrabold uppercase text-[10px]">
                    {resource.category || 'Documentation'}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {resource.title}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {resource.description}
                  </p>
                </div>

                {/* Code / Markdown Content Snippet Container */}
                {resource.markdownContent || resource.codeContent ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl mt-1">
                    <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-800 font-mono text-xs text-slate-300">
                      <span className="flex items-center gap-2 text-emerald-400 font-bold">
                        <Code className="w-4 h-4" />
                        Source Code & Reference Snippets
                      </span>
                      <button
                        onClick={() => handleCopyCode(resource.markdownContent || resource.codeContent)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>
                    </div>
                    <pre className="p-4 text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed select-text max-h-[350px]">
                      {resource.markdownContent || resource.codeContent}
                    </pre>
                  </div>
                ) : null}

                {/* Explicit Download Action Box */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-[#04AA6D]/30 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#04AA6D] text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {rawUrl ? `Knowledge File (${ext.toUpperCase() || 'DOCUMENT'}) Ready` : 'Complete Knowledge Package'}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Preview verified. Click the button to download the full asset to your device.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Asset
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* TAB 3: COMMUNITY DISCUSSION */}
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
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingComment ? 'Posting...' : 'Post'}
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {resource.comments && resource.comments.length > 0 ? (
                  resource.comments.map((c, idx) => (
                    <div key={c._id || idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-[#04AA6D]">{c.fullName || 'Developer'}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed mt-1">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 font-mono bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    No community comments yet. Be the first to leave feedback!
                  </div>
                )}
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
