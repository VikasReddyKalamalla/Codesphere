import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Link2, Calendar, Edit2, CheckCircle, Copy,
  Globe, Code2, Award, Star, Users,
  ClipboardList, BookOpen, Download, Video, MessageSquare,
  ExternalLink, Camera, Save, X,
  Zap, Trophy, BookMarked, Flame, ShieldCheck, Plus, Layers,
} from 'lucide-react';
import { FiGithub as Github, FiLinkedin as Linkedin, FiTwitter as Twitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchProfileAPI, updateProfileAPI, uploadAvatarAPI, uploadCertificateAPI } from '../services/profileAPI.js';
import { updateUser } from '@features/auth/redux/authSlice.js';
import { socket } from '../../../socket/socket.js';

const TABS = ['Overview', 'Activity', 'Achievements', 'Bookmarks', 'Collections', 'Settings'];

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((s) => s.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    avatar: '',
    skills: '',
  });

  const [certForm, setCertForm] = useState({ title: '', issuer: '' });
  const certFileRef = useRef(null);
  const [uploadingCert, setUploadingCert] = useState(false);

  /* Real-time streak & contribution listener */
  useEffect(() => {
    const handleStreakUpdate = (data) => {
      if (data?.dayStreak !== undefined) {
        setProfile((prev) => {
          if (!prev) return prev;
          const newTotal = data.totalContributions ?? ((prev.totalContributions || 0) + 1);
          return {
            ...prev,
            dayStreak: data.dayStreak,
            totalContributions: newTotal,
          };
        });
        dispatch(updateUser({
          dayStreak: data.dayStreak,
          totalContributions: data.totalContributions,
        }));
      }
    };

    socket.on('user:streak_updated', handleStreakUpdate);
    return () => {
      socket.off('user:streak_updated', handleStreakUpdate);
    };
  }, [dispatch]);

  /* Load user profile */
  useEffect(() => {
    fetchProfileAPI()
      .then((r) => {
        const p = r?.data || r;
        setProfile(p);
        setForm({
          fullName: p.fullName || '',
          username: p.username || '',
          bio: p.bio || '',
          website: p.website || '',
          location: p.location || '',
          avatar: p.avatar || '',
          skills: p.skills ? p.skills.join(', ') : '',
        });
      })
      .catch(() => {
        const p = authUser || {};
        setProfile(p);
        setForm({
          fullName: p.fullName || '',
          username: p.username || '',
          bio: p.bio || '',
          website: p.website || '',
          location: p.location || '',
          avatar: p.avatar || '',
          skills: p.skills ? p.skills.join(', ') : '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const loadingToast = toast.loading('Uploading avatar...');
    try {
      const res = await uploadAvatarAPI(file);
      const updatedUser = res?.data || res;
      setProfile((prev) => ({ ...prev, avatar: updatedUser.avatar }));
      dispatch(updateUser({ avatar: updatedUser.avatar }));
      toast.success('Avatar updated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar', { id: loadingToast });
    }
  };

  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    const file = certFileRef.current?.files?.[0];
    if (!file) return toast.error('Please select a file');

    setUploadingCert(true);
    const loadingToast = toast.loading('Uploading certificate...');
    try {
      const res = await uploadCertificateAPI(certForm, file);
      setProfile((prev) => ({ ...prev, certificates: [...(prev.certificates || []), res.data || res] }));
      setCertForm({ title: '', issuer: '' });
      certFileRef.current.value = '';
      toast.success('Certificate uploaded!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to upload', { id: loadingToast });
    } finally {
      setUploadingCert(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      await updateProfileAPI(payload);
      setProfile((prev) => ({ ...prev, ...payload }));
      dispatch(updateUser(payload));
      toast.success('Profile updated successfully!');
      setActiveTab('Overview');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://codesphere.dev/u/${profile?.username || 'user'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Profile link copied to clipboard!');
  };

  const cardClass = 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl text-slate-900 dark:text-slate-100 shadow-sm backdrop-blur-md';
  const inputClass = 'w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-sans';

  const displayName = profile?.fullName || authUser?.fullName || 'User';
  const displayUser = profile?.username || authUser?.username || 'username';
  const displayBio = profile?.bio || 'No bio provided yet.';
  const displayLoc = profile?.location || 'No location set';
  const displaySite = profile?.website || '';
  const displayRole = profile?.role || authUser?.role || 'Student';
  const displayAvatar = profile?.avatar || authUser?.avatar || '';
  const joinedDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const xp = profile?.achievementPoints ?? authUser?.achievementPoints ?? 0;
  const level = Math.floor(xp / 100) + 1;
  const followers = profile?.followers?.length ?? authUser?.followers?.length ?? 0;

  const enrolledPathsCount = profile?.learningPaths?.length || 0;
  const userBadges = [
    { name: 'Rising Star', icon: '⭐', desc: 'Earned 100 XP points', unlocked: xp >= 100 },
    { name: 'Dedicated Learner', icon: '🔥', desc: 'Earned 500 XP points', unlocked: xp >= 500 },
    { name: 'Full-Stack Expert', icon: '🏆', desc: 'Earned 1000 XP points', unlocked: xp >= 1000 },
    { name: 'Code Master', icon: '👑', desc: 'Earned 2500 XP points', unlocked: xp >= 2500 },
  ];

  const stats = [
    { icon: Code2, color: '#3b82f6', value: enrolledPathsCount, label: 'Projects' },
    { icon: Award, color: '#f59e0b', value: userBadges.filter((b) => b.unlocked).length, label: 'Badges' },
    { icon: Star, color: '#10b981', value: xp, label: 'Points' },
    { icon: Users, color: '#8b5cf6', value: followers, label: 'Followers' },
  ];

  const activitySummary = [
    { icon: Code2, label: 'Code Submissions', count: profile?.submissionsCount || 0 },
    { icon: ClipboardList, label: 'Tests Completed', count: profile?.testsCount || 0 },
    { icon: Download, label: 'Resources Downloaded', count: profile?.downloadsCount || 0 },
    { icon: Video, label: 'Sessions Attended', count: profile?.sessionsCount || 0 },
    { icon: MessageSquare, label: 'Communities Joined', count: profile?.communitiesCount || 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#04AA6D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900 dark:text-slate-100 font-sans animate-fade-in pb-12">
      
      {/* ── 1. HERO HEADER CARD ── */}
      <div className="rounded-3xl relative overflow-hidden shadow-sm dark:shadow-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
        {/* Banner */}
        <div className="h-36 sm:h-48 w-full relative bg-gradient-to-r from-[#04AA6D] via-teal-600 to-emerald-700 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Content area */}
        <div className="p-6 md:p-8 pt-0 z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Left: Avatar + Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 flex-1 min-w-0">
              <div className="relative shrink-0 -mt-14 sm:-mt-18">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xl">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                      {displayName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#04AA6D] hover:bg-[#03935e] flex items-center justify-center border-2 border-white dark:border-slate-900 cursor-pointer shadow-md transition-all text-white"
                  title="Change avatar"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <div className="pt-2 sm:pt-0 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {displayName}
                  </h1>
                  {(profile?.isVerified || authUser?.isVerified) && (
                    <CheckCircle className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white font-mono bg-[#04AA6D] shadow-xs">
                    Level {level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 self-start md:self-end shrink-0">
              <button
                onClick={copyProfileLink}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-[#04AA6D]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Link' : 'Share Profile'}
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'Settings' ? 'Overview' : 'Settings')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all bg-[#04AA6D] hover:bg-[#03935e] text-white shadow-lg shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                {activeTab === 'Settings' ? 'View Overview' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Details below title & avatar */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#04AA6D] dark:text-emerald-400" />
                {displayLoc}
              </span>
              {displaySite && (
                <a
                  href={displaySite.startsWith('http') ? displaySite : `https://${displaySite}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#04AA6D] transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                  {displaySite}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                Joined {joinedDate}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {displayBio}
            </p>

            <div className="flex gap-2.5 mt-1">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. CONTRIBUTION HEATMAP GRID ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-3 font-mono">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            2026 Coding Contributions & Activity
          </h4>
          <span className="text-[10px] text-slate-400 font-mono">
            {(profile?.totalContributions ?? authUser?.totalContributions ?? 0)} total contribution{(profile?.totalContributions ?? authUser?.totalContributions ?? 0) === 1 ? '' : 's'}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto py-2">
          {(profile?.contributions || Array.from({ length: 52 }, () => Array.from({ length: 7 }, () => ({ count: 0 })))).map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.map((day, dayIdx) => {
                const count = day.count || 0;
                const bgClass = count === 0
                  ? 'bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40'
                  : count === 1
                  ? 'bg-emerald-900/40 border border-emerald-700/30'
                  : count === 2
                  ? 'bg-emerald-600'
                  : 'bg-[#04AA6D] shadow-xs';
                return (
                  <div
                    key={dayIdx}
                    title={day.date ? `${day.date}: ${count} contribution${count === 1 ? '' : 's'}` : `Week ${weekIdx + 1}, Day ${dayIdx + 1}: 0 contributions`}
                    className={`w-3.5 h-3.5 rounded-xs transition-all ${bgClass}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. TABS NAVIGATION ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 no-scrollbar overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? 'border-[#04AA6D] text-[#04AA6D] dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 4. MAIN CONTENT + SIDEBAR GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* MAIN TAB AREA (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Top Skills */}
              <div className={cardClass}>
                <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider mb-4 font-mono">
                  Top Skills & Technologies
                </h3>
                {profile?.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono flex items-center gap-1.5"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400 text-xs font-mono">
                    <p>No skills added yet.</p>
                    <button
                      onClick={() => setActiveTab('Settings')}
                      className="mt-2 text-[#04AA6D] dark:text-emerald-400 font-bold hover:underline"
                    >
                      + Add skills in Profile Settings
                    </button>
                  </div>
                )}
              </div>

              {/* Achievements & Badges Preview */}
              <div className={cardClass}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider font-mono">
                    Earned Badges & Credentials
                  </h3>
                  <button
                    onClick={() => setActiveTab('Achievements')}
                    className="text-xs font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline font-mono"
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        badge.unlocked
                          ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                          : 'bg-slate-100/50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-800/40 opacity-50'
                      }`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{badge.name}</span>
                        <span className="text-[10px] text-slate-500">{badge.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider font-mono">
                    Recent Activity
                  </h3>
                  <button
                    onClick={() => setActiveTab('Activity')}
                    className="text-xs font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline font-mono"
                  >
                    View Timeline
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {profile?.activity && profile.activity.length > 0 ? (
                    profile.activity.map((act, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-[#04AA6D]">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{act.title}</p>
                          <p className="text-[11px] text-slate-500">{act.sub}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{act.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 font-mono text-center py-6">
                      No recent activity recorded.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ACTIVITY */}
          {activeTab === 'Activity' && (
            <div className={cardClass}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
                Activity Log & Submissions
              </h3>
              <div className="flex flex-col gap-3">
                {profile?.activity && profile.activity.length > 0 ? (
                  profile.activity.map((act, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10 text-[#04AA6D]">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{act.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{act.sub}</p>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">{act.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 font-mono text-xs">
                    <p>No activity records available yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS */}
          {activeTab === 'Achievements' && (
            <div className={cardClass}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
                Upload External Certificate
              </h3>
              <form onSubmit={handleUploadCertificate} className="flex flex-col gap-4 max-w-lg mb-8">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Certificate Title
                  </label>
                  <input
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="e.g. Advanced React Patterns"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Issuer / Organization
                  </label>
                  <input
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="e.g. FreeCodeCamp, Coursera"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Certificate File (PDF or Image)
                  </label>
                  <input
                    type="file"
                    ref={certFileRef}
                    accept=".pdf,image/*"
                    className={inputClass}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadingCert}
                  className="px-5 py-2.5 bg-[#04AA6D] hover:bg-[#03935e] text-white font-bold rounded-xl text-xs transition-all self-start cursor-pointer shadow-md"
                >
                  {uploadingCert ? 'Uploading...' : 'Upload Certificate'}
                </button>
              </form>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider pt-6 border-t border-slate-200 dark:border-slate-800 mb-4">
                Your Earned Certificates
              </h3>
              {profile?.certificates?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.certificates.map((cert) => (
                    <a
                      key={cert._id}
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-col p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-[#04AA6D]/50 transition-all group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[#04AA6D] transition-colors">
                          {cert.title || cert.course?.title || 'Certificate'}
                        </h4>
                        <Award className="w-5 h-5 text-[#04AA6D] shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Issued by: {cert.issuer || 'CodeSphere'}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono py-4">No certificates uploaded yet.</p>
              )}
            </div>
          )}

          {/* TAB 4: BOOKMARKS */}
          {activeTab === 'Bookmarks' && (
            <div className={cardClass}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
                Saved Resources & Bookmarks
              </h3>
              <p className="text-xs text-slate-400 font-mono py-6 text-center">
                No bookmarked items saved yet. Browse learning resources to bookmark notes and docs.
              </p>
            </div>
          )}

          {/* TAB 5: COLLECTIONS */}
          {activeTab === 'Collections' && (
            <div className={cardClass}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
                Saved Collections
              </h3>
              <p className="text-xs text-slate-400 font-mono py-6 text-center">
                No custom collections created yet.
              </p>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'Settings' && (
            <div className={cardClass}>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Edit Profile Settings
                </h3>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Full Name</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Username</label>
                    <input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                    maxLength={200}
                    placeholder="Tell other developers about your journey and tech stack..."
                    className={`${inputClass} resize-none`}
                  />
                  <p className="text-[10px] text-right mt-1 text-slate-400 font-mono">{form.bio.length} / 200</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Website</label>
                    <input
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://yoursite.dev"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Location</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="City, Country"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Skills (comma-separated)
                  </label>
                  <input
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    placeholder="JavaScript, React, Node.js, Python"
                    className={inputClass}
                  />
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Avatar Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                      {displayAvatar ? (
                        <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-base font-bold text-slate-500 dark:text-slate-400">
                          {displayName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="text-xs font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline block cursor-pointer"
                      >
                        Click to upload new avatar
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">JPG, PNG or GIF (Max. 2MB)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('Overview')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#04AA6D] hover:bg-[#03935e] text-white shadow-md transition-all cursor-pointer"
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR AREA (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Profile Stats */}
          <div className={cardClass}>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
              Profile Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}20` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-base font-black leading-none text-slate-900 dark:text-white font-mono">{s.value}</p>
                    <p className="text-[9px] mt-1 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className={cardClass}>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider mb-4">
              Activity Summary
            </h3>
            <div className="flex flex-col gap-2.5">
              {activitySummary.map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">{label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connect / Public Link */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                Public Profile
              </h3>
              <button
                onClick={() => navigate(`/u/${displayUser}`)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline cursor-pointer font-mono"
              >
                View Public <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Share your public profile URL with recruiters and developers.
            </p>
            <button
              onClick={copyProfileLink}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#04AA6D] transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-[#04AA6D]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied URL!' : `codesphere.dev/u/${displayUser}`}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
