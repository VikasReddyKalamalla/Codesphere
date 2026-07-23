import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Clock, Trophy, Users, Globe, ExternalLink, Bookmark, CheckCircle2,
  FileText, Download, Share2, Award, Sparkles, MessageSquare, ShieldCheck, UserCheck, HelpCircle,
  QrCode, Send, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

export const EventDetailModal = ({ event, onClose, isRegistered, isBookmarked, onRegister, onBookmark }) => {
  if (!event) return null;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'hackathon', 'speakers', 'agenda', 'resources', 'discussion'
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    { id: 1, name: 'Alex Rivera', role: 'Full Stack Dev', text: 'Looking forward to the AI Copilot track! Anyone interested in forming a team?', time: '2 hours ago' },
    { id: 2, name: 'Elena Rostova', role: 'ML Engineer', text: 'Will workshop slides be uploaded before the hackathon begins?', time: '5 hours ago' }
  ]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentsList([
      ...commentsList,
      { id: Date.now(), name: 'You', role: 'Developer', text: commentText.trim(), time: 'Just now' }
    ]);
    setCommentText('');
    toast.success('Comment posted to event discussion!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  const handleDownloadBrochure = () => {
    toast.success(`Downloading brochure for ${event.title}...`);
  };

  const handleExportICS = () => {
    const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.venue || event.city}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
    toast.success('Calendar event (.ics) exported!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#070a13] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col overflow-hidden font-sans"
        >
          {/* Top Banner Image with Close Button */}
          <div className="relative w-full h-56 md:h-72 bg-slate-900 overflow-hidden shrink-0">
            <img
              src={event.bannerImage || event.thumbnail || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
              alt={event.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 border border-slate-700 text-slate-300 hover:text-white rounded-full transition-all backdrop-blur-md cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Header Info */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 z-10">
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#04AA6D]/20 border border-[#04AA6D]/50 text-emerald-300 backdrop-blur-md font-mono">
                    {event.eventType || 'Event'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 backdrop-blur-md font-mono">
                    {event.mode || 'Online'}
                  </span>
                  {event.prizePool && (
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-mono backdrop-blur-md flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-emerald-400" />
                      {event.prizePool}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  {event.title}
                </h1>

                <div className="flex items-center gap-3 text-xs text-slate-300 font-sans">
                  <span>Hosted by <strong className="text-emerald-400">{event.companyName || event.organizer?.fullName || 'CodeSphere Alliance'}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onBookmark}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer backdrop-blur-md ${
                    isBookmarked
                      ? 'bg-[#04AA6D] border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title="Bookmark Event"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                  title="Share Event"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onRegister}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center gap-2 ${
                    isRegistered
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-[#04AA6D] to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white shadow-emerald-900/25 border border-emerald-400/30'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Register Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/60 shrink-0 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview & Syllabus' },
              { id: 'hackathon', label: 'Hackathon Tracks & Prizes' },
              { id: 'speakers', label: 'Speakers & Agenda' },
              { id: 'resources', label: 'Resources & FAQs' },
              { id: 'discussion', label: 'Community Discussion' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#04AA6D] text-[#04AA6D] dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">About the Event</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                      {event.description || 'Join developers, software architects, and tech innovators globally for this immersive experience.'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Eligibility & Guidelines</h3>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {event.eligibility || 'Open to all students, professionals, and open-source contributors worldwide. No registration fee required.'}
                    </div>
                  </div>

                  {event.tags?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Technologies Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(t => (
                          <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#04AA6D] dark:text-emerald-300 font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleExportICS}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#04AA6D]" />
                      Add to Calendar (.ics)
                    </button>
                    <button
                      onClick={handleDownloadBrochure}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      Download Event Brochure
                    </button>
                  </div>
                </div>

                {/* Right Quick Info Box */}
                <div className="flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl self-start">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">Event Particulars</h3>

                  <div className="flex flex-col gap-3 text-xs text-slate-700 dark:text-slate-300 font-sans">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#04AA6D] shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">Date & Schedule</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {new Date(event.startDate).toLocaleDateString()} — {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">Location & Venue</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{event.venue || 'Virtual Headquarters'}, {event.city}, {event.country}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white">Capacity</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{event.registeredParticipants || 0} / {event.maxParticipants || 'Unlimited'} Seats</span>
                      </div>
                    </div>
                  </div>

                  {isRegistered && (
                    <div className="mt-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-2 items-center text-center">
                      <QrCode className="w-12 h-12 text-[#04AA6D] dark:text-emerald-400" />
                      <span className="text-xs font-bold text-[#04AA6D] dark:text-emerald-300">Verified Ticket QR Code</span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">Present this digital pass at check-in</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'hackathon' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-[#04AA6D] dark:text-emerald-400 font-mono">1ST PLACE CHAMPION</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{event.prizes?.[0]?.reward || '$15,000 Cash + Cloud Credits'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{event.prizes?.[0]?.description || 'Includes Direct Fast-track Interviews'}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-blue-500 dark:text-blue-400 font-mono">RUNNER UP</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{event.prizes?.[1]?.reward || '$7,500 Cash + Swag'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{event.prizes?.[1]?.description || 'Includes Mentorship Session'}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase text-[#04AA6D] dark:text-emerald-400 font-mono">3RD PLACE</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">{event.prizes?.[2]?.reward || '$3,000 Cash'}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{event.prizes?.[2]?.description || 'Dev Goodies & Hardware'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Problem Statement Tracks</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(event.problemStatements?.length > 0 ? event.problemStatements : [
                      { track: 'AI Agents & LLMs', title: 'Autonomous Multi-agent Developer Workflows', description: 'Build AI software development assistants that automatically debug, test, and deploy microservices.' },
                      { track: 'Web3 & Security', title: 'Zero-Knowledge Privacy Layer', description: 'Design ZK proof tools for decentralized identity and smart contract security verification.' }
                    ]).map((ps, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#04AA6D] font-mono">{ps.track}</span>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{ps.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{ps.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(event.speakers?.length > 0 ? event.speakers : [
                    { name: 'Dr. Aris Thorne', role: 'Principal AI Architect', company: 'Google DeepMind', topic: 'Next-Gen Agentic Models', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' },
                    { name: 'Sophia Chen', role: 'Head of Developer Relations', company: 'GitHub', topic: 'Building Extensible AI Ecosystems', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
                    { name: 'Marcus Vance', role: 'VP of Cloud Security', company: 'AWS', topic: 'Securing Serverless Workflows', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }
                  ]).map((sp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                      <img src={sp.avatar} alt={sp.name} className="w-12 h-12 rounded-full object-cover border border-emerald-500/40" />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">{sp.name}</span>
                        <span className="text-[10px] text-[#04AA6D] font-bold">{sp.role} · {sp.company}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic">Topic: "{sp.topic}"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Frequently Asked Questions</h3>
                <div className="flex flex-col gap-3">
                  {(event.faqs?.length > 0 ? event.faqs : [
                    { question: 'Who can register for this webcast/hackathon?', answer: 'Anyone interested in coding, software development, AI, or cloud engineering can register for free.' },
                    { question: 'Will participation certificates be issued?', answer: 'Yes, CodeSphere automatically issues verified digital certificates to all registered attendees.' }
                  ]).map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                      <span className="font-bold text-xs text-[#04AA6D]">Q: {faq.question}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">A: {faq.answer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="flex flex-col gap-6">
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question or start a discussion..."
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default EventDetailModal;
