import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MapPin, Link2, Calendar, Edit2, CheckCircle, Copy,
  Globe,
  Code2, Award, Star, Users,
  ClipboardList, BookOpen, Download, Video, MessageSquare,
  ExternalLink, Camera, Save, X,
  Zap, Trophy, BookMarked,
} from 'lucide-react';
import { FiGithub as Github, FiLinkedin as Linkedin, FiTwitter as Twitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchProfileThunk, updateProfileThunk } from '../redux/profileThunk.js';
import { fetchProfileAPI, updateProfileAPI, uploadAvatarAPI } from '../services/profileAPI.js';
import { updateUser } from '@features/auth/redux/authSlice.js';

/* ─────────────────────────────── helpers ─────────────────────────────── */
const TABS = ['Overview', 'Activity', 'Achievements', 'Bookmarks', 'Collections', 'Settings'];

const SKILLS = [
  { name: 'JavaScript', color: '#F7DF1E', text: '#000' },
  { name: 'React',      color: '#61DAFB', text: '#000' },
  { name: 'Node.js',    color: '#339933', text: '#fff' },
  { name: 'Python',     color: '#3776AB', text: '#fff' },
  { name: 'MongoDB',    color: '#47A248', text: '#fff' },
  { name: 'Tailwind CSS', color: '#06B6D4', text: '#fff' },
];

const ACHIEVEMENTS = [
  { icon: '🏆', title: 'Code Master',     desc: 'Solved 100 coding challenges',  date: 'May 10, 2025' },
  { icon: '⭐', title: 'Top Contributor', desc: 'Active in the community',        date: 'Apr 28, 2025' },
  { icon: '🎯', title: 'Quiz Expert',     desc: 'Scored 95%+ in 10 tests',        date: 'Apr 15, 2025' },
];

const ACTIVITY = [
  { icon: Code2,      color: '#3b82f6', bg: '#dbeafe', title: 'Solved Two Sum problem',      sub: 'in Data Structures',       time: '2 hours ago'  },
  { icon: Award,      color: '#8b5cf6', bg: '#ede9fe', title: 'Completed React.js Basics test', sub: 'Score: 92%',            time: '1 day ago'    },
  { icon: Download,   color: '#f59e0b', bg: '#fef3c7', title: 'Downloaded System Design Notes', sub: 'PDF',                   time: '2 days ago'   },
  { icon: MessageSquare, color: '#10b981', bg: '#d1fae5', title: 'Joined the community',     sub: 'React Developers',          time: '3 days ago'  },
];

/* ─────────────────────────────── main component ─────────────────────── */
export const Profile = () => {
  const dispatch   = useDispatch();
  const { user: authUser } = useSelector((s) => s.auth);

  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('Overview');
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [copied,     setCopied]     = useState(false);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    fullName: '', username: '', bio: '', website: '', location: '', avatar: '', skills: '',
  });

  /* load profile */
  useEffect(() => {
    fetchProfileAPI()
      .then((r) => {
        const p = r?.data || r;
        setProfile(p);
        setForm({
          fullName: p.fullName || '',
          username: p.username || '',
          bio:      p.bio      || '',
          website:  p.website  || '',
          location: p.location || '',
          avatar:   p.avatar   || '',
          skills:   p.skills ? p.skills.join(', ') : '',
        });
      })
      .catch(() => {
        // fallback to auth user
        const p = authUser || {};
        setProfile(p);
        setForm({
          fullName: p.fullName || '',
          username: p.username || '',
          bio:      p.bio      || '',
          website:  p.website  || '',
          location: p.location || '',
          avatar:   p.avatar   || '',
          skills:   p.skills ? p.skills.join(', ') : '',
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      await updateProfileAPI(payload);
      setProfile((prev) => ({ ...prev, ...payload }));
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to save');
    } finally { setSaving(false); }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`https://codesphere.dev/u/${profile?.username || 'user'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const cardClass = "bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 p-5 rounded-3xl text-slate-900 dark:text-slate-100 shadow-sm backdrop-blur-md";
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-sans";

  const displayName   = profile?.fullName   || authUser?.fullName   || 'User';
  const displayUser   = profile?.username   || authUser?.username   || 'username';
  const displayBio    = profile?.bio        || 'No bio provided yet.';
  const displayLoc    = profile?.location   || 'No location set';
  const displaySite   = profile?.website    || '';
  const displayRole   = profile?.role       || authUser?.role       || 'Student';
  const displayAvatar = profile?.avatar     || authUser?.avatar     || '';
  const joinedDate    = profile?.createdAt  ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const xp            = profile?.achievementPoints ?? authUser?.achievementPoints ?? 0;
  const level         = Math.floor(xp / 100) + 1;
  const followers     = profile?.followers?.length ?? authUser?.followers?.length ?? 0;

  const enrolledPathsCount = profile?.learningPaths?.length || 0;
  const userBadges = [];
  if (xp >= 100)  userBadges.push({ name: 'Rising Star',    icon: '⭐', desc: 'Earned 100 XP points', date: 'Unlocked' });
  if (xp >= 500)  userBadges.push({ name: 'Dedicated',      icon: '🔥', desc: 'Earned 500 XP points', date: 'Unlocked' });
  if (xp >= 1000) userBadges.push({ name: 'Expert',         icon: '🏆', desc: 'Earned 1000 XP points', date: 'Unlocked' });

  const stats = [
    { icon: Code2,  color: '#3b82f6', value: enrolledPathsCount,      label: 'Projects'  },
    { icon: Award,  color: '#f59e0b', value: userBadges.length,       label: 'Badges'    },
    { icon: Star,   color: '#10b981', value: xp,                      label: 'Points' },
    { icon: Users,  color: '#8b5cf6', value: followers,               label: 'Followers' },
  ];

  const activitySummary = [
    { icon: Code2,        label: 'Code Submissions',    count: 0 },
    { icon: ClipboardList,label: 'Tests Completed',     count: 0 },
    { icon: Download,     label: 'Resources Downloaded',count: 0 },
    { icon: Video,        label: 'Sessions Attended',   count: 0 },
    { icon: MessageSquare,label: 'Communities Joined',  count: 0 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#04AA6D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900 dark:text-slate-100 font-sans animate-fade-in">

      {/* ── Top hero card ── */}
      <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 z-10 relative">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#04AA6D]/40 bg-slate-800 flex items-center justify-center shadow-lg">
              {displayAvatar
                ? <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-white">{displayName.slice(0, 2).toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#04AA6D] hover:bg-emerald-600 flex items-center justify-center border-2 border-slate-900 cursor-pointer shadow-md transition-all">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-black text-white tracking-tight">{displayName}</h1>
              {(profile?.isVerified || authUser?.isVerified) && <CheckCircle className="w-5 h-5 text-[#04AA6D]" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white font-mono bg-[#04AA6D]">Level {level}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-300 capitalize bg-slate-800/80 border border-slate-700/60">{displayRole}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3 font-mono">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#04AA6D]" />{displayLoc}</span>
              {displaySite && <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-blue-400" />{displaySite}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" />Joined {joinedDate}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">{displayBio}</p>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <button key={i} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(!editing)}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
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

      {/* ── Main 3-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT — Edit form (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Edit Profile</h3>
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-xs font-medium px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="text-xs font-bold px-4 py-1.5 rounded-xl text-white bg-[#04AA6D] hover:bg-emerald-600 transition-all cursor-pointer shadow-xs">
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={inputClass}
                />
                <button type="button" onClick={copyProfileLink} className="flex items-center gap-1 mt-1.5 text-xs text-[#04AA6D] dark:text-emerald-400 hover:underline font-mono">
                  <span>codesphere.dev/u/{form.username}</span>
                  {copied ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  maxLength={200}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-[10px] text-right mt-1 text-slate-400 font-mono">{form.bio.length} / 200</p>
              </div>

              {/* Website + Location */}
              <div className="grid grid-cols-2 gap-3">
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

              {/* Skills */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Skills (comma-separated)</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="JavaScript, React, Python"
                  className={inputClass}
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                    {displayAvatar
                      ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{displayName.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-semibold text-[#04AA6D] dark:text-emerald-400 hover:underline block cursor-pointer">Click to change avatar</button>
                    <span className="text-[10px] text-slate-400 font-mono">JPG, PNG or GIF (Max. 2MB)</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* CENTER — Public preview (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Public Profile Preview</h3>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#04AA6D] dark:text-emerald-400 hover:underline cursor-pointer">
                View Public Profile <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Mini profile card */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-700">
                {displayAvatar
                  ? <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-500 dark:text-slate-400">{displayName.slice(0,2).toUpperCase()}</div>
                }
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</p>
                  {(profile?.isVerified || authUser?.isVerified) && <CheckCircle className="w-4 h-4 text-[#04AA6D]" />}
                </div>
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white bg-[#04AA6D] font-mono">Level {level}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">{displayRole}</span>
                </div>
                <div className="flex gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#04AA6D]" />{displayLoc}</span>
                  {displaySite && <span className="flex items-center gap-1"><Link2 className="w-3 h-3 text-blue-400" />{displaySite}</span>}
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4 text-slate-600 dark:text-slate-400">{displayBio}</p>

            {/* Mini stats */}
            <div className="grid grid-cols-4 gap-2 py-3 mb-4 border-y border-slate-200 dark:border-slate-800 font-mono">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{s.value}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Top Skills */}
            <div className="mb-5">
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-2.5 uppercase font-mono tracking-wider">Top Skills</p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#04AA6D]/10 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400 font-mono">No skills listed yet.</p>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white mb-3 uppercase font-mono tracking-wider">Recent Achievements</p>
              <div className="flex flex-col gap-3">
                {userBadges.length > 0 ? (
                  userBadges.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{a.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{a.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold font-mono">{a.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-mono">No achievements earned yet. Start learning to unlock!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Stats sidebar (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">

          {/* Profile Stats */}
          <div className={cardClass}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase font-mono tracking-wider">Profile Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}20` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-base font-black leading-none text-slate-900 dark:text-white font-mono">{s.value}</p>
                    <p className="text-[10px] mt-1 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className={cardClass}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase font-mono tracking-wider">Activity Summary</h3>
            <div className="flex flex-col gap-3">
              {activitySummary.map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
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

          {/* Recent Activity */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Recent Activity</h3>
              <button className="text-xs font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline font-mono cursor-pointer">View All</button>
            </div>
            <div className="flex flex-col gap-4">
              {xp > 0 ? (
                ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.bg }}>
                      <a.icon className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{a.title}</p>
                      <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">{a.sub}</p>
                      <p className="text-[10px] mt-0.5 text-slate-400 font-mono">{a.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-mono text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Connect */}
          <div className={cardClass}>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase font-mono tracking-wider">Connect</h3>
            <div className="flex gap-3">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#04AA6D] cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
