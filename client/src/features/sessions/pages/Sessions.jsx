import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Video, Search, SlidersHorizontal, Calendar, Award, BookOpen, Clock, Users, Flame, Plus,
  FileCode, Layers, ShieldCheck, Sparkles, RefreshCcw
} from 'lucide-react';
import { fetchSessionsThunk, fetchMySessionsThunk, fetchCertificatesThunk } from '../redux/sessionThunk.js';
import { selectSessionItems, selectRegisteredSessions, selectCertificates, selectSessionsLoading } from '../redux/sessionSelectors.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import toast from 'react-hot-toast';
import { duplicateSessionAPI, archiveSessionAPI } from '../services/sessionAPI.js';

export const Sessions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessions = useSelector(selectSessionItems);
  const registeredSessions = useSelector(selectRegisteredSessions);
  const certificates = useSelector(selectCertificates);
  const loading = useSelector(selectSessionsLoading);
  const currentUser = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState('browse'); // browse, registered, recordings, certificates
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, live, upcoming, completed
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all'); // all, free, premium

  useEffect(() => {
    dispatch(fetchSessionsThunk());
    dispatch(fetchMySessionsThunk());
    dispatch(fetchCertificatesThunk());
  }, [dispatch]);

  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    try {
      await duplicateSessionAPI(id);
      toast.success('Session duplicated successfully as Draft');
      dispatch(fetchSessionsThunk());
    } catch (err) {
      toast.error(err.message || 'Failed to duplicate session');
    }
  };

  const handleArchive = async (e, id) => {
    e.stopPropagation();
    try {
      await archiveSessionAPI(id);
      toast.success('Session archived successfully');
      dispatch(fetchSessionsThunk());
    } catch (err) {
      toast.error(err.message || 'Failed to archive session');
    }
  };

  // Filter logic
  const filteredSessions = (activeTab === 'browse' ? sessions : registeredSessions).filter((s) => {
    const matchesSearch = s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || s.difficulty === difficultyFilter;
    const matchesPrice = priceFilter === 'all' ||
      (priceFilter === 'free' && !s.isPremium) ||
      (priceFilter === 'premium' && s.isPremium);

    return matchesSearch && matchesStatus && matchesDifficulty && matchesPrice;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            LIVE NOW
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
            UPCOMING
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-500/10 text-slate-400 border border-slate-500/20">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20">
            DRAFT
          </span>
        );
    }
  };

  const canManage = currentUser?.role === 'instructor' || currentUser?.role === 'admin';

  return (
    <div className="flex flex-col gap-8 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200">
      
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Live Sessions (Webcasts)
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Attend live lectures, collaborate in real-time, share whiteboard ideas, run code, and boost your expertise with our masterclasses.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => navigate('/sessions/create')}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 active:scale-95 transition-all text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Session
          </button>
        )}
      </div>

      {/* Navigation tabs & Search bar */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 p-2 rounded-2xl backdrop-blur-md z-10">
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'browse', label: 'Browse Sessions', icon: BookOpen },
            { id: 'registered', label: 'My Registered Sessions', icon: Layers },
            { id: 'recordings', label: 'Recorded Lectures', icon: Video },
            { id: 'certificates', label: 'My Certificates', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all select-none cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30 shadow-inner'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search sessions, topics, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono-origin"
          />
        </div>
      </div>

      {/* Main Grid area with filters sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 z-10 flex-1">
        {/* Filters Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-6 bg-slate-50/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 p-5 rounded-2xl backdrop-blur-md self-start">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Filters</span>
            </div>
            <button
              onClick={() => {
                setStatusFilter('all');
                setDifficultyFilter('all');
                setPriceFilter('all');
              }}
              className="text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Live Status</span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'live', label: 'Live Now' },
                { id: 'upcoming', label: 'Upcoming Classes' },
                { id: 'completed', label: 'Completed classes' }
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === status.id
                      ? 'bg-white dark:bg-slate-900 text-[#04AA6D] dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-950/40 border border-transparent'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Difficulty</span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'beginner', label: 'Beginner' },
                { id: 'intermediate', label: 'Intermediate' },
                { id: 'advanced', label: 'Advanced' }
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficultyFilter(diff.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    difficultyFilter === diff.id
                      ? 'bg-white dark:bg-slate-900 text-[#04AA6D] dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-950/40 border border-transparent'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Filter */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Access Type</span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'all', label: 'All Access' },
                { id: 'free', label: 'Free Tier' },
                { id: 'premium', label: 'Premium Class' }
              ].map((price) => (
                <button
                  key={price.id}
                  onClick={() => setPriceFilter(price.id)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    priceFilter === price.id
                      ? 'bg-white dark:bg-slate-900 text-[#04AA6D] dark:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-950/40 border border-transparent'
                  }`}
                >
                  {price.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions list */}
        <div className="xl:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCcw className="w-8 h-8 text-[#04AA6D] dark:text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">Querying database...</p>
            </div>
          ) : activeTab === 'certificates' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <div key={cert._id} className="relative overflow-hidden bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex flex-col gap-4 hover:border-emerald-500/30 transition-all shadow-sm dark:shadow-md group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-[#04AA6D] dark:text-emerald-400 tracking-wider font-mono">VERIFIED CERTIFICATE</span>
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-1">{cert.sessionId?.title}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Verification Code: {cert.verificationCode}</p>
                      </div>
                      <Award className="w-10 h-10 text-[#04AA6D] dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100 dark:border-slate-900">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Issued: {new Date(cert.createdAt).toLocaleDateString()}</span>
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#04AA6D] dark:hover:text-emerald-400 rounded-xl transition-all"
                      >
                        Download PDF
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-900 p-8 rounded-2xl">
                  <Award className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3" />
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-400">No Certificates Earned Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-sm">
                    Complete 80% or more of any live session webcast, check in, and download your personalized credentials.
                  </p>
                </div>
              )}
            </div>
          ) : filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => navigate(`/sessions/${session._id}`)}
                  className="group bg-white dark:bg-slate-950/20 hover:bg-slate-50/80 dark:hover:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 hover:border-emerald-500/30 p-5 rounded-2xl flex flex-col justify-between gap-5 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-lg relative cursor-pointer hover:shadow-emerald-500/5"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-4">
                      {getStatusBadge(session.status)}
                      <span className="text-[10px] font-black bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        {session.difficulty}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-[#04AA6D] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {session.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {session.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{session.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{session.registeredCount} / {session.maxCapacity} Registered</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {session.host?.avatar ? (
                            <img src={session.host.avatar} alt={session.host.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-black text-[#04AA6D] dark:text-emerald-400">
                              {session.host?.fullName?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{session.host?.fullName}</span>
                      </div>

                      {canManage && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDuplicate(e, session._id)}
                            title="Duplicate Session"
                            className="p-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-all cursor-pointer"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          {session.status !== 'archived' && (
                            <button
                              onClick={(e) => handleArchive(e, session._id)}
                              title="Archive Session"
                              className="p-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 rounded-lg text-slate-500 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-all cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-50 dark:bg-slate-950/10 border border-dashed border-slate-200 dark:border-slate-900 p-8 rounded-2xl">
              <Sparkles className="w-12 h-12 text-slate-400 dark:text-slate-700 mb-3 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-400">No Webcasts Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 max-w-sm">
                No active live session fits your search query or filters. Check back soon or request a custom workshop.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
