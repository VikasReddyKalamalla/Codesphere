import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Link2, Calendar, CheckCircle, Code2, Award, Star, Users, ExternalLink, Globe 
} from 'lucide-react';
import { FiGithub as Github, FiLinkedin as Linkedin, FiTwitter as Twitter } from 'react-icons/fi';
import { fetchPublicProfileAPI } from '../services/profileAPI';
import { BackButton } from '@components/common/BackButton.jsx';

export const PublicProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetchPublicProfileAPI(username)
      .then(res => {
        setProfile(res.data || res);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'User not found');
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-[#04AA6D] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{error || 'Profile Not Found'}</h2>
        <Link to="/" className="text-sm font-bold text-[#04AA6D] hover:underline">Return Home</Link>
      </div>
    );
  }

  const displayName   = profile.fullName || 'User';
  const displayBio    = profile.bio || 'No bio provided yet.';
  const displayLoc    = profile.location || 'No location set';
  const displaySite   = profile.website || '';
  const displayRole   = profile.role || 'Student';
  const displayAvatar = profile.avatar || '';
  const joinedDate    = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const xp            = profile.achievementPoints ?? 0;
  const level         = Math.floor(xp / 100) + 1;
  const followers     = profile.followers?.length ?? 0;
  const certificates  = profile.certificates || [];

  const enrolledPathsCount = profile.learningPaths?.length || 0;
  const stats = [
    { icon: Code2,  color: '#3b82f6', value: enrolledPathsCount, label: 'Projects'  },
    { icon: Award,  color: '#f59e0b', value: certificates.length, label: 'Certificates' },
    { icon: Star,   color: '#10b981', value: xp,                 label: 'Points' },
    { icon: Users,  color: '#8b5cf6', value: followers,          label: 'Followers' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto text-slate-900 dark:text-slate-100 font-sans animate-fade-in p-4 md:p-6">
      <BackButton fallbackPath="/" />
      
      {/* ── Top hero card ── */}
      <div className="rounded-3xl relative overflow-hidden shadow-sm dark:shadow-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md">
        <div className="h-32 sm:h-44 w-full relative bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
        <div className="p-6 md:p-8 pt-0 z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 flex-1 min-w-0">
              <div className="relative shrink-0 -mt-12 sm:-mt-16">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-xl">
                  {displayAvatar
                    ? <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                    : <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">{displayName.slice(0, 2).toUpperCase()}</span>
                  }
                </div>
              </div>
              <div className="pt-2 sm:pt-0 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{displayName}</h1>
                  {profile.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-blue-600">Level {level}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{displayRole}</span>
                </div>
              </div>
            </div>
            <div className="self-start md:self-end shrink-0">
              <button className="px-6 py-2.5 rounded-2xl text-xs font-bold transition-all bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                Follow User
              </button>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-500" />{displayLoc}</span>
              {displaySite && <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-blue-500" />{displaySite}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" />Joined {joinedDate}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{displayBio}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Profile Stats */}
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold mb-4 uppercase font-mono tracking-wider">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black leading-none">{s.value}</p>
                    <p className="text-[10px] uppercase text-slate-500 mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top Skills */}
          <div className="bg-white dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold mb-4 uppercase font-mono tracking-wider">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? profile.skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  {s}
                </span>
              )) : (
                <p className="text-xs text-slate-500 italic">No skills listed</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Certificates Showcase */}
          <div className="bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-full">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Certifications & Achievements
            </h3>
            
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map(cert => (
                  <a key={cert._id} href={cert.certificateUrl} target="_blank" rel="noreferrer" className="flex flex-col p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-500/50 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                        <Award className="w-5 h-5" />
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{cert.title || cert.course?.title || 'Certificate'}</h4>
                    <p className="text-xs text-slate-500 mt-1">Issued by: {cert.issuer || 'CodeSphere'}</p>
                    <p className="text-[10px] text-slate-400 mt-3 font-mono">Issued {new Date(cert.issuedDate).toLocaleDateString()}</p>
                  </a>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Award className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm font-semibold">No certificates showcased yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublicProfilePage;
