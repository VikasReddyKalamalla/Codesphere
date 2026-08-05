import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Globe, Code, Cpu, Terminal, Smartphone, GitBranch, Briefcase, 
  MessageSquare, Plus, Users, PlusCircle 
} from 'lucide-react';
import { selectCommunityItems } from '../redux/communitySelectors.js';
import { joinCommunityThunk, leaveCommunityThunk } from '../redux/communityThunk.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { isCommunityMember } from '../utils/communityHelpers.js';

export const CommunitySidebar = ({ activeCommunityId, selectedCategory, onCategoryChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const communities = useSelector(selectCommunityItems) || [];
  const currentUser = useSelector(selectCurrentUser);

  const categoryList = [
    { label: 'Web Development', icon: Globe },
    { label: 'Programming Languages', icon: Code },
    { label: 'AI / Machine Learning', icon: Cpu },
    { label: 'DevOps', icon: Terminal },
    { label: 'Mobile Development', icon: Smartphone },
    { label: 'Open Source', icon: GitBranch },
    { label: 'Career & Jobs', icon: Briefcase },
    { label: 'General Discussion', icon: MessageSquare }
  ];

  const handleJoinToggle = (e, communityId, isJoined) => {
    e.stopPropagation();
    if (isJoined) {
      const comm = communities.find(c => c._id === communityId);
      if (window.confirm(`Are you sure you want to leave ${comm?.name || 'this community'}?`)) {
        dispatch(leaveCommunityThunk(communityId));
      }
    } else {
      dispatch(joinCommunityThunk(communityId));
    }
  };

  const joinedCommunities = communities.filter((comm) => isCommunityMember(comm, currentUser));
  const discoverCommunities = communities.filter((comm) => !isCommunityMember(comm, currentUser));

  return (
    <aside className="w-80 bg-white dark:bg-[#0b0f19] border-r border-slate-200 dark:border-slate-800 flex flex-col select-none shrink-0 h-full text-left">
      
      {/* Sidebar Header - matches the height and bottom border of main content header */}
      <div className="bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-slate-800 px-6 flex items-center shrink-0 h-24">
        <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Spaces</h2>
      </div>

      {/* Scrollable Sidebar Body */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* Section 0: My Joined Communities */}
        {joinedCommunities.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#04AA6D] animate-pulse" />
                <span>My Spaces</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-[#04AA6D] bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                {joinedCommunities.length} Joined
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {joinedCommunities.map((comm) => {
                const isActive = comm._id === activeCommunityId;
                return (
                  <div 
                    key={comm._id}
                    onClick={() => navigate(`/community/${comm._id}`)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20 shadow-xs' 
                        : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200/60 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-950/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                        {comm.logo ? (
                          <img src={comm.logo} alt={comm.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{comm.name}</span>
                        <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500">{comm.memberCount || 0} Members</span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => handleJoinToggle(e, comm._id, true)}
                      className="text-[9px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-500/20 transition-all cursor-pointer"
                    >
                      Joined
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 1: Discover Communities */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">Discover Communities</h4>
            <button 
              onClick={() => navigate('/community')}
              className="text-[10px] font-bold text-[#04AA6D] dark:text-emerald-400 hover:underline transition-colors uppercase font-mono"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {discoverCommunities.slice(0, 5).map((comm) => {
              const isMember = isCommunityMember(comm, currentUser);
              const isActive = comm._id === activeCommunityId;
              
              return (
                <div 
                  key={comm._id}
                  onClick={() => navigate(`/community/${comm._id}`)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-slate-50 dark:bg-slate-950/30 border-slate-200/60 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-950/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0">
                      {comm.logo ? (
                        <img src={comm.logo} alt={comm.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{comm.name}</span>
                      <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500">{comm.memberCount || 0} Members</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => handleJoinToggle(e, comm._id, isMember)}
                    style={{
                      backgroundColor: isMember ? 'transparent' : '#04AA6D',
                      borderColor: isMember ? undefined : '#04AA6D',
                      color: isMember ? undefined : '#ffffff',
                    }}
                    className={`text-[9px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                      isMember 
                        ? 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-500/20' 
                        : 'hover:opacity-90'
                    }`}
                  >
                    {isMember ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Categories */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">Categories</h4>
          <div className="flex flex-col gap-1">
            {categoryList.map((cat, idx) => {
              const isActive = selectedCategory === cat.label;
              return (
                <button 
                  key={idx}
                  onClick={() => onCategoryChange && onCategoryChange(isActive ? null : cat.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-[#04AA6D] dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-950/40 border-transparent'
                  }`}
                >
                  <cat.icon size={14} className={isActive ? 'text-[#04AA6D] dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Create Your Space Callout Card */}
        <div className="mt-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-xs shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">Create Your Space</h5>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Build your own space, grow your community, and share knowledge.</p>
          <button 
            onClick={() => navigate('/community/create')}
            className="w-full mt-4 bg-[#04AA6D] hover:bg-[#03935e] text-white text-[10px] font-bold font-mono uppercase tracking-wider py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <PlusCircle size={12} />
            <span>Create Community</span>
          </button>
        </div>

        {/* Bottom spacer to prevent clipping and give proper margin/padding */}
        <div className="h-4 shrink-0" />
      </div>
    </aside>
  );
};
export default CommunitySidebar;
