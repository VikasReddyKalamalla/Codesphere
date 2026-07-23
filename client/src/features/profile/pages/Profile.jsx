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

  const card = { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16 };
  const muted = '#888';

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
        <div className="w-8 h-8 rounded-full border-4 border-t-blue-600 animate-spin" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: '#2563eb' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full" style={{ color: '#111' }}>

      {/* ── Top hero card ── */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ ...card, background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2040 60%, #111827 100%)' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 bg-slate-700 flex items-center justify-center">
              {displayAvatar
                ? <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-white">{displayName.slice(0, 2).toUpperCase()}</span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#04AA6D] flex items-center justify-center border-2 border-white cursor-pointer">
              <Camera className="w-3 h-3 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h1 className="text-xl font-bold text-white">{displayName}</h1>
              {(profile?.isVerified || authUser?.isVerified) && <CheckCircle className="w-5 h-5 text-emerald-300" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: '#04AA6D' }}>Level {level}</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold text-emerald-200 capitalize" style={{ background: 'rgba(255,255,255,0.1)' }}>{displayRole}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-emerald-200 mb-3">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{displayLoc}</span>
              {displaySite && <span className="flex items-center gap-1"><Link2 className="w-3.5 h-3.5" />{displaySite}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined {joinedDate}</span>
            </div>
            <p className="text-sm text-emerald-100/90 max-w-lg leading-relaxed">{displayBio}</p>
            {/* Social icons */}
            <div className="flex gap-3 mt-3">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <button key={i} className="text-emerald-300 hover:text-white transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(!editing)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b" style={{ borderColor: 'rgba(0,0,0,0.09)' }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              color:        activeTab === tab ? '#04AA6D' : '#888',
              borderBottom: activeTab === tab ? '2px solid #04AA6D' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Main 3-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* LEFT — Edit form (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold" style={{ color: '#111' }}>Edit Profile</h3>
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#888', background: 'transparent' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="text-xs font-bold px-4 py-1.5 rounded-lg text-white transition-colors" style={{ background: '#04AA6D' }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                />
                <button type="button" onClick={copyProfileLink} className="flex items-center gap-1 mt-1.5 text-xs text-[#04AA6D] hover:underline">
                  <span>codesphere.dev/u/{form.username}</span>
                  {copied ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={4}
                  maxLength={200}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-none focus:outline-none"
                  style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                />
                <p className="text-xs text-right mt-0.5" style={{ color: '#bbb' }}>{form.bio.length} / 200</p>
              </div>

              {/* Website + Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Website</label>
                  <input
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://yoursite.dev"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#555' }}>Skills (comma-separated)</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="JavaScript, React, Python"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ background: '#F9F9F7', border: '1px solid rgba(0,0,0,0.1)', color: '#111' }}
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: '#555' }}>Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center shrink-0">
                    {displayAvatar
                      ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-sm font-bold text-slate-500">{displayName.slice(0, 2).toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-semibold text-[#04AA6D] hover:underline block">Click to change avatar</button>
                    <span className="text-xs" style={{ color: '#bbb' }}>JPG, PNG or GIF (Max. 2MB)</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* CENTER — Public preview (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold" style={{ color: '#111' }}>Public Profile Preview</h3>
              <button className="flex items-center gap-1 text-xs font-semibold text-[#04AA6D] hover:underline">
                View Public Profile <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Mini profile card */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                {displayAvatar
                  ? <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-500">{displayName.slice(0,2).toUpperCase()}</div>
                }
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold" style={{ color: '#111' }}>{displayName}</p>
                  {(profile?.isVerified || authUser?.isVerified) && <CheckCircle className="w-4 h-4 text-[#04AA6D]" />}
                </div>
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded font-bold text-white bg-[#04AA6D]">Level {level}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-medium capitalize" style={{ background: '#F5F4F0', color: '#555' }}>{displayRole}</span>
                </div>
                <div className="flex gap-3 mt-1.5 text-xs" style={{ color: '#888' }}>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{displayLoc}</span>
                  {displaySite && <span className="flex items-center gap-1"><Link2 className="w-3 h-3" />{displaySite}</span>}
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed mb-4" style={{ color: '#666' }}>{displayBio}</p>

            {/* Mini stats */}
            <div className="grid grid-cols-4 gap-2 py-3 mb-4 border-y" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-bold" style={{ color: '#111' }}>{s.value}</span>
                  <span className="text-[10px]" style={{ color: '#aaa' }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Top Skills */}
            <div className="mb-5">
              <p className="text-xs font-bold mb-2.5" style={{ color: '#111' }}>Top Skills</p>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-[#04AA6D] border border-emerald-100">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs italic" style={{ color: '#aaa' }}>No skills listed yet.</p>
              )}
            </div>

            {/* Recent Achievements */}
            <div>
              <p className="text-xs font-bold mb-3" style={{ color: '#111' }}>Recent Achievements</p>
              <div className="flex flex-col gap-3">
                {userBadges.length > 0 ? (
                  userBadges.map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{a.icon}</span>
                        <div>
                          <p className="text-xs font-bold" style={{ color: '#111' }}>{a.name}</p>
                          <p className="text-[11px]" style={{ color: '#aaa' }}>{a.desc}</p>
                        </div>
                      </div>
                      <span className="text-[11px]" style={{ color: '#bbb' }}>{a.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-450">No achievements earned yet. Start learning to unlock!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Stats sidebar (col-span-4) */}
        <div className="xl:col-span-4 flex flex-col gap-5">

          {/* Profile Stats */}
          <div className="rounded-2xl p-5" style={card}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111' }}>Profile Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-base font-bold leading-none" style={{ color: '#111' }}>{s.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="rounded-2xl p-5" style={card}>
            <h3 className="text-sm font-bold mb-4" style={{ color: '#111' }}>Activity Summary</h3>
            <div className="flex flex-col gap-3">
              {activitySummary.map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#F5F4F0' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: '#666' }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#444' }}>{label}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#111' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl p-5" style={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold" style={{ color: '#111' }}>Recent Activity</h3>
              <button className="text-xs font-semibold text-[#04AA6D] hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-4">
              {xp > 0 ? (
                ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.bg }}>
                      <a.icon className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#111' }}>{a.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#aaa' }}>{a.sub}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#bbb' }}>{a.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-450 text-center py-4">No recent activity.</p>
              )}
            </div>
          </div>

          {/* Connect */}
          <div className="rounded-2xl p-5" style={card}>
            <h3 className="text-sm font-bold mb-3" style={{ color: '#111' }}>Connect</h3>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter, Globe].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: '#F5F4F0', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <Icon className="w-4 h-4" style={{ color: '#555' }} />
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
