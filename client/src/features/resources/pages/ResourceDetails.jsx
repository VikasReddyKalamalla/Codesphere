import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText, Code, Video, Download, Eye, Bookmark, Star, Sparkles, Share2,
  ArrowLeft, CheckCircle2, MessageSquare, Send, Copy, ExternalLink, ShieldCheck,
  Layers, GitBranch, UserCheck, Calendar, Clock, ZoomIn, ZoomOut, Maximize2,
  Check, ThumbsUp, FolderArchive, Globe, Terminal, BookOpen, ChevronRight, FileCode
} from 'lucide-react';
import toast from 'react-hot-toast';

import { fetchResourceByIdThunk } from '../redux/resourceThunk.js';
import { selectSelectedResource, selectUserBookmarks } from '../redux/resourceSelectors.js';
import { toggleBookmark } from '../redux/resourceSlice.js';
import { BackButton } from '@components/common/BackButton.jsx';

export const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resource = useSelector(selectSelectedResource);
  const userBookmarks = useSelector(selectUserBookmarks);

  const [activeTab, setActiveTab] = useState('preview'); // preview, description, discussion
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { id: 1, name: 'Alex Rivera', role: 'Senior Developer', text: 'This reference architecture guide and code starter saved me hours during our production system design review!', time: '2 hours ago', likes: 12 },
    { id: 2, name: 'Elena Rostova', role: 'Full Stack Engineer', text: 'Clean code examples, structured PDF notes, and clear diagrams. Highly recommended for interview prep!', time: '5 hours ago', likes: 8 }
  ]);
  
  // Interactive PDF / Code State
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFile, setActiveFile] = useState('server.js');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchResourceByIdThunk(id));
    }
  }, [id, dispatch]);

  const isBookmarked = userBookmarks.includes(id || resource?._id);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Resource link copied to clipboard!');
  };

  const handleDownload = () => {
    toast.success(`Downloading ${resource?.title || 'Resource'}...`);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      { id: Date.now(), name: 'You', role: 'Developer', text: commentText.trim(), time: 'Just now', likes: 0 },
      ...commentsList
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

  // Sample code files dictionary for Source Code / Starter Kit previews
  const codeFiles = {
    'server.js': resource.codeContent || `// CodeSphere Production Server Architecture
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Main Resource Route Endpoint
app.get('/api/resources', async (req, res) => {
  res.json({ success: true, message: "${resource.title} loaded" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));`,
    'auth.controller.js': `// Authentication & Role Management Controller
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;
  // Verify credentials & sign JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ success: true, token, user });
};

module.exports = { login };`,
    'package.json': `{
  "name": "${(resource.slug || 'codesphere-resource').toLowerCase()}",
  "version": "1.0.0",
  "description": "${resource.description ? resource.description.slice(0, 80) : 'CodeSphere Resource Template'}",
  "main": "server.js",
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.3.0",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5"
  }
}`
  };

  const isPDF = resource.resourceType === 'pdf' || resource.resourceType === 'notes';
  const isCode = resource.resourceType === 'source_code' || resource.resourceType === 'github' || resource.resourceType === 'zip' || Boolean(resource.codeContent);
  const isVideo = resource.resourceType === 'video';
  const isDoc = resource.resourceType === 'documentation' || resource.resourceType === 'link';

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 animate-fade-in">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <BackButton fallbackPath="/resources" className="self-start" />

      {/* Top Banner Header in Rich CodeSphere Emerald & Dark Teal */}
      <div className="relative w-full bg-gradient-to-r from-slate-950 via-[#0b2b1d] to-slate-950 border border-[#04AA6D]/40 rounded-3xl p-6 md:p-8 overflow-hidden shadow-2xl text-white">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col gap-3.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#04AA6D]/20 text-emerald-400 border border-[#04AA6D]/40 font-mono">
                {resource.resourceType ? resource.resourceType.toUpperCase().replace('_', ' ') : 'RESOURCE'}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 font-mono">
                {resource.difficulty || 'BEGINNER'}
              </span>
              {resource.isPremium && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  PREMIUM
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight font-sans">
              {resource.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {resource.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-sans pt-1">
              <span>Author: <strong className="text-emerald-400 font-bold">{resource.instructor || resource.uploadedBy?.fullName || 'Sarah Chen (CodeSphere Alliance)'}</strong></span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {resource.averageRating || 4.9} (128 reviews)
              </span>
            </div>
          </div>

          {/* Action Header Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
            <button
              onClick={() => dispatch(toggleBookmark(id || resource._id))}
              className={`p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                isBookmarked
                  ? 'bg-[#04AA6D] border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Bookmark Resource"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-6 py-3 rounded-2xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-xl shadow-emerald-950/50 border border-emerald-400/40 transition-all cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Resource
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 no-scrollbar overflow-x-auto">
            {[
              { id: 'preview', label: 'Interactive Preview & Viewer' },
              { id: 'description', label: 'Detailed Overview & Notes' },
              { id: 'discussion', label: `Community Discussion (${commentsList.length})` },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3.5 font-extrabold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === t.id
                    ? 'border-[#04AA6D] text-[#04AA6D] dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: INTERACTIVE PREVIEW & VIEWER */}
          {activeTab === 'preview' && (
            <div className="flex flex-col gap-5">
              {/* PDF & Document Reader Viewer */}
              {isPDF && (
                <div className="flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
                  {/* PDF Toolbar */}
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-300 select-none">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-[#04AA6D] shrink-0" />
                      <span className="font-bold truncate text-white">{resource.title}.pdf</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-[11px]">
                        <button 
                          onClick={() => setZoomLevel(Math.max(75, zoomLevel - 25))}
                          className="hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-emerald-400">{zoomLevel}%</span>
                        <button 
                          onClick={() => setZoomLevel(Math.min(175, zoomLevel + 25))}
                          className="hover:text-emerald-400 transition-colors cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">Page 1 of 8</span>

                      <button
                        onClick={handleDownload}
                        className="px-3 py-1 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </button>
                    </div>
                  </div>

                  {/* Rendered PDF Document Canvas Sheet */}
                  <div className="p-6 md:p-10 bg-slate-900/50 flex justify-center items-center min-h-[500px] overflow-auto">
                    <div 
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                      className="w-full max-w-2xl bg-white text-slate-900 p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-200 transition-transform duration-300 font-sans flex flex-col gap-6"
                    >
                      {/* PDF Header */}
                      <div className="flex justify-between items-start border-b-2 border-[#04AA6D] pb-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase text-[#04AA6D] tracking-widest font-mono">CODESPHERE OFFICIAL REFERENCE NOTE</span>
                          <h2 className="text-xl md:text-2xl font-black tracking-tight">{resource.title}</h2>
                        </div>
                        <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">Page 1</span>
                      </div>

                      {/* PDF Content Overview */}
                      <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-700 leading-relaxed">
                        <p className="font-semibold text-slate-900">{resource.description}</p>
                        
                        <div className="bg-emerald-50 border-l-4 border-[#04AA6D] p-4 rounded-r-xl flex flex-col gap-1 text-emerald-950 text-xs">
                          <strong className="font-bold text-[#04AA6D] uppercase tracking-wider">Key Takeaway & Core Architecture</strong>
                          <span>This verified cheat sheet covers production patterns, scalability trade-offs, and best practices used by top engineering teams.</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-slate-900 pt-2 border-b pb-1">1. Executive Summary & Prerequisites</h4>
                        <p>
                          {resource.markdownContent || 'Before implementing these patterns, ensure your environment meets the minimum runtime specifications. Refer to the code blocks and architectural diagrams below for reference implementations.'}
                        </p>

                        <div className="bg-slate-950 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto shadow-inner">
                          <code>{`// CodeSphere Architecture Reference\nconst systemConfig = {\n  highAvailability: true,\n  scalingStrategy: "horizontal",\n  replicationFactor: 3,\n  status: "verified"\n};`}</code>
                        </div>
                      </div>

                      {/* PDF Footer Watermark */}
                      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>CodeSphere Knowledge Hub © 2026</span>
                        <span>{resource.categoryName || 'General CS'} · Verified Guide</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Source Code & IDE Viewer */}
              {isCode && !isPDF && (
                <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono">
                  {/* File Tabs Header */}
                  <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                      {Object.keys(codeFiles).map(fileName => (
                        <button
                          key={fileName}
                          onClick={() => setActiveFile(fileName)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            activeFile === fileName
                              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 text-[#04AA6D]" />
                          <span>{fileName}</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopyCode(codeFiles[activeFile] || resource.codeContent)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer text-[11px] font-bold shrink-0 transition-colors"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Code Snippet Window */}
                  <div className="p-5 text-xs text-emerald-300 bg-slate-950 overflow-x-auto leading-relaxed select-text font-mono min-h-[380px]">
                    <pre>{codeFiles[activeFile] || resource.codeContent}</pre>
                  </div>
                </div>
              )}

              {/* Video Tutorial Player */}
              {isVideo && (
                <div className="flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                  <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                    {resource.externalUrl && resource.externalUrl.includes('youtube') ? (
                      <iframe
                        src={resource.externalUrl.replace('watch?v=', 'embed/')}
                        title={resource.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4 p-8 text-center">
                        <Video className="w-16 h-16 text-[#04AA6D] animate-bounce" />
                        <span className="text-sm font-bold text-white font-mono">Interactive Video Tutorial Stream</span>
                        {resource.externalUrl && (
                          <a
                            href={resource.externalUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                          >
                            Watch Video Source
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documentation & Live Article Reader */}
              {isDoc && !isPDF && !isCode && (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-5 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2 text-[#04AA6D] font-mono text-xs font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>VERIFIED DOCUMENTATION & REFERENCE ARTICLE</span>
                  </div>

                  <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line">
                    {resource.markdownContent || resource.description}
                  </p>

                  {resource.externalUrl && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-mono truncate max-w-md">{resource.externalUrl}</span>
                      <a
                        href={resource.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shrink-0"
                      >
                        Open External Reference
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DETAILED OVERVIEW & NOTES */}
          {activeTab === 'description' && (
            <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-sans">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#04AA6D] font-mono">Detailed Knowledge Overview</h3>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {resource.markdownContent || resource.description || 'This resource includes complete code examples, architecture diagrams, and step-by-step cheat sheets verified by CodeSphere instructors.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COMMUNITY DISCUSSION */}
          {activeTab === 'discussion' && (
            <div className="flex flex-col gap-6">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or leave feedback for the author..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#04AA6D]"
                />
                <button type="submit" className="px-6 py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              <div className="flex flex-col gap-3">
                {commentsList.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#04AA6D]">{c.name} <span className="text-[10px] text-slate-500 font-mono">({c.role})</span></span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono">
                      <button className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{c.likes} Likes</span>
                      </button>
                      <span>·</span>
                      <button className="hover:text-emerald-400 transition-colors cursor-pointer">Reply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR: RESOURCE PARTICULARS */}
        <div className="flex flex-col gap-5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl self-start font-sans">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200 dark:border-slate-800 font-mono">
            Resource Particulars
          </h3>

          <div className="flex flex-col gap-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#04AA6D] shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Published Date</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{new Date(resource.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-blue-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Total Views</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{resource.views || 980} views</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Total Downloads</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{resource.downloadsCount || 580} downloads</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-purple-500 shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white">Format & License</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{resource.resourceType ? resource.resourceType.toUpperCase() : 'PDF'} · Open Access</span>
              </div>
            </div>
          </div>

          {/* Author / Instructor Card */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">Verified Instructor</span>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-[#04AA6D] text-white flex items-center justify-center font-bold text-sm shadow-md">
                {resource.instructor ? resource.instructor[0] : 'S'}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">{resource.instructor || resource.uploadedBy?.fullName || 'Sarah Chen'}</span>
                <span className="text-[10px] text-emerald-500 font-mono font-bold">CodeSphere Staff Instructor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
