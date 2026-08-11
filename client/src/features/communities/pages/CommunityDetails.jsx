import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, Users, Shield, MessageSquare, Settings, 
  UserPlus, UserMinus, Plus, Bell, Calendar, Sparkles, BookOpen, AlertCircle
} from 'lucide-react';
import { 
  fetchCommunityDetailsThunk, 
  joinCommunityThunk, 
  leaveCommunityThunk,
  fetchPostsThunk 
} from '../redux/communityThunk.js';
import { 
  selectActiveCommunity, 
  selectCommunityPosts, 
  selectCommunities 
} from '../redux/communitySelectors.js';
import { CreatePost } from '../components/CreatePost.jsx';
import { PostCard } from '../components/PostCard.jsx';
import { CommunityChat } from '../components/CommunityChat.jsx';
import { CommunityMembers } from '../components/CommunityMembers.jsx';
import { CommunitySidebar } from '../components/CommunitySidebar.jsx';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { promoteModeratorAPI, removeModeratorAPI } from '../services/communityAPI.js';
import toast from 'react-hot-toast';

export const CommunityDetails = () => {
  const { communityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const community = useSelector(selectActiveCommunity);
  const posts = useSelector(selectCommunityPosts);
  const currentUser = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState('feed'); // feed, members, about, chat, rules
  const [filter, setFilter] = useState('new'); // hot, new, top

  const isMember = community?.members?.some(m => m === currentUser?._id || m._id === currentUser?._id);
  const isOwner = community?.owner?._id === currentUser?._id || community?.owner === currentUser?._id;
  const isModerator = community?.moderators?.some(m => m === currentUser?._id || m._id === currentUser?._id);
  const hasSettingsAccess = isOwner || isModerator;

  useEffect(() => {
    if (communityId) {
      dispatch(fetchCommunityDetailsThunk(communityId));
      dispatch(fetchPostsThunk(communityId));
    }
  }, [communityId, dispatch]);

  const handleJoinToggle = () => {
    if (isMember) {
      if (window.confirm(`Are you sure you want to leave ${community.name}?`)) {
        dispatch(leaveCommunityThunk(communityId));
      }
    } else {
      dispatch(joinCommunityThunk(communityId));
    }
  };

  const handlePromoteModerator = async (targetUserId) => {
    try {
      await promoteModeratorAPI(communityId, targetUserId);
      toast.success('Member promoted to moderator!');
      dispatch(fetchCommunityDetailsThunk(communityId));
    } catch (err) {
      toast.error('Failed to promote member');
    }
  };

  const handleRemoveModerator = async (targetUserId) => {
    try {
      await removeModeratorAPI(communityId, targetUserId);
      toast.success('Moderator demoted successfully');
      dispatch(fetchCommunityDetailsThunk(communityId));
    } catch (err) {
      toast.error('Failed to demote moderator');
    }
  };

  if (!community) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-slate-500 font-mono text-[10px] uppercase bg-slate-50 dark:bg-[#080d1a]">
        Loading active space...
      </div>
    );
  }

  // Filter posts
  const filteredPosts = [...posts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (filter === 'hot') {
      return (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount);
    }
    if (filter === 'top') {
      return b.likeCount - a.likeCount;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="bg-slate-550/5 dark:bg-[#080d1a] h-full flex-1 flex text-slate-700 dark:text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Left persistent sidebar */}
      <CommunitySidebar activeCommunityId={communityId} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar h-full">
        
        {/* Cover Banner */}
        <div className="h-44 sm:h-52 w-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
          <img 
            src={community.banner || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=300&q=80"} 
            alt={community.name} 
            className="w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#080d1a] via-transparent to-black/10" />
          
          {/* Back Button inside banner */}
          <button 
            onClick={() => navigate('/community')}
            className="absolute left-6 top-6 bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:text-slate-850 dark:hover:text-white px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 backdrop-blur z-10 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer shadow-sm"
          >
            <ArrowLeft size={12} />
            <span>All Spaces</span>
          </button>
        </div>

        {/* Details Wrapper */}
        <div className="max-w-[1200px] w-full mx-auto px-6 relative mt-[-40px] z-10 flex flex-col gap-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-150 dark:border-slate-900 pb-5">
            <div className="flex items-start sm:items-end gap-4.5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 flex items-center justify-center shrink-0 shadow-xl">
                {community.logo ? (
                  <img src={community.logo} alt={community.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-9 h-9 text-indigo-650 dark:text-indigo-400" />
                )}
              </div>
              
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide font-mono">{community.name}</h2>
                  <Shield size={14} className="text-[#04AA6D] dark:text-indigo-400 fill-indigo-500/10" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-medium">{community.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {community.tags?.map((tag, idx) => (
                    <span key={idx} className="text-[8px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-655 dark:text-indigo-450 border border-indigo-100 dark:border-indigo-500/10 px-1.5 py-0.5 rounded uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
              {hasSettingsAccess && (
                <button 
                  onClick={() => navigate(`/community/${communityId}/settings`)}
                  className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-205 p-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                  title="Settings"
                >
                  <Settings size={15} />
                </button>
              )}

              <button 
                onClick={handleJoinToggle}
                className={`text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                  isMember 
                    ? 'bg-transparent text-slate-500 dark:text-slate-455 border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-650 hover:border-red-500/20' 
                    : 'bg-[#04AA6D] text-white border-[#04AA6D] hover:bg-[#03935e] hover:border-[#03935e] shadow-lg shadow-emerald-500/20'
                }`}
              >
                {isMember ? (
                  <>
                    <UserMinus size={13} />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={13} />
                    <span>Join Space</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tab Menu Header */}
          <div className="flex border-b border-slate-150 dark:border-slate-900 overflow-x-auto no-scrollbar font-mono text-[10px] font-black uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`px-5 py-3 border-b-2 transition-all shrink-0 ${activeTab === 'feed' ? 'border-indigo-500 text-slate-800 dark:text-slate-100 bg-indigo-50/50 dark:bg-indigo-950/5' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Discussions
            </button>
            
            <button 
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-3 border-b-2 transition-all shrink-0 ${activeTab === 'chat' ? 'border-[#04AA6D] text-[#04AA6D] dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Live Rocket.Chat
            </button>

            <button 
              onClick={() => setActiveTab('members')}
              className={`px-5 py-3 border-b-2 transition-all shrink-0 ${activeTab === 'members' ? 'border-indigo-500 text-slate-800 dark:text-slate-100 bg-indigo-50/50 dark:bg-indigo-950/5' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Collaborators
            </button>

            <button 
              onClick={() => setActiveTab('rules')}
              className={`px-5 py-3 border-b-2 transition-all shrink-0 ${activeTab === 'rules' ? 'border-indigo-500 text-slate-800 dark:text-slate-100 bg-indigo-50/50 dark:bg-indigo-950/5' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              Rules & Conduct
            </button>
          </div>

          {/* Grid Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Feed View */}
              {activeTab === 'feed' && (
                <>
                  {isMember ? (
                    <CreatePost communityId={communityId} />
                  ) : (
                    <div className="bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 select-none shadow-sm">
                      <AlertCircle size={20} className="text-slate-400 dark:text-slate-500" />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider">Join to Post</span>
                      <p className="text-xs text-slate-500">You must be a member of this community to create posts.</p>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="flex border-b border-slate-150 dark:border-slate-900 pb-2.5 font-mono text-[9px] font-bold uppercase tracking-wider gap-4">
                    <button 
                      onClick={() => setFilter('new')}
                      className={`hover:text-slate-800 dark:hover:text-slate-205 transition-colors ${filter === 'new' ? 'text-indigo-650 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      Newest
                    </button>
                    <button 
                      onClick={() => setFilter('hot')}
                      className={`hover:text-slate-800 dark:hover:text-slate-205 transition-colors ${filter === 'hot' ? 'text-indigo-650 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      Trending
                    </button>
                    <button 
                      onClick={() => setFilter('top')}
                      className={`hover:text-slate-800 dark:hover:text-slate-205 transition-colors ${filter === 'top' ? 'text-indigo-650 dark:text-indigo-400 font-black' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                      Top Voted
                    </button>
                  </div>

                  {/* Feed posts list */}
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2">
                      <MessageSquare className="w-6 h-6 text-slate-400 dark:text-slate-700 animate-pulse" />
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">Lobby feed is empty</p>
                      <p className="text-xs text-slate-500 dark:text-slate-600">Be the first to publish a discussion thread!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {filteredPosts.map((post) => (
                        <PostCard key={post._id} post={post} community={community} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Chat view */}
              {activeTab === 'chat' && (
                <>
                  {isMember ? (
                    <CommunityChat communityId={communityId} communityName={community.name} />
                  ) : (
                    <div className="bg-white dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2 select-none h-[400px] shadow-sm">
                      <AlertCircle size={24} className="text-slate-400 dark:text-slate-500" />
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase tracking-wider">Member Only Access</span>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">Please join this community space to access realtime lobby chat channels.</p>
                    </div>
                  )}
                </>
              )}

              {/* Members view */}
              {activeTab === 'members' && (
                <CommunityMembers 
                  members={community.membersDetails || []} 
                  moderators={community.moderators || []}
                  owner={community.owner}
                  onPromote={handlePromoteModerator}
                  onRemove={handleRemoveModerator}
                  currentUserId={currentUser?._id}
                />
              )}

              {/* Rules view */}
              {activeTab === 'rules' && (
                <div className="bg-white dark:bg-[#0b0f19] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl text-left flex flex-col gap-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5">
                    <BookOpen size={12} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Conduct & Safety Rules</span>
                  </div>
                  
                  {community.rules ? (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap select-text">{community.rules}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono text-center py-6">No specific rules set for this community.</p>
                  )}
                </div>
              )}

            </div>

            {/* Right Sidebar Column */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              
              {/* About community card */}
              <div className="bg-white dark:bg-[#0b0f19] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl text-left flex flex-col gap-4">
                <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5">
                  <Sparkles size={12} className="text-indigo-550 dark:text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">About Space</span>
                </div>
                
                <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>Category:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-202">{community.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Members Total:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-202">{community.memberCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Threads Created:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-202">{community.postCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Created At:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-202">{new Date(community.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Moderators List Card */}
              <div className="bg-white dark:bg-[#0b0f19] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl text-left flex flex-col gap-3.5">
                <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-855 pb-2.5">
                  <Shield size={12} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Moderators</span>
                </div>
                
                <div className="flex flex-col gap-3 font-mono text-[9px] text-slate-400 dark:text-slate-550 uppercase">
                  <div className="flex items-center gap-2">
                    <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-955 flex items-center justify-center shrink-0">
                      {community.owner?.avatar ? (
                        <img src={community.owner.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-slate-500 uppercase">
                          {(community.owner?.fullName || 'U').slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-700 dark:text-slate-350 font-bold">{community.owner?.fullName}</span>
                    <span className="text-[7px] bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 px-1 py-0.2 rounded border border-indigo-100 dark:border-indigo-500/10 font-bold tracking-wide uppercase">Owner</span>
                  </div>

                  {community.moderatorsDetails?.map((mod) => (
                    <div key={mod._id} className="flex items-center gap-2">
                      <div className="w-5.5 h-5.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center shrink-0">
                        <img src={mod.avatar} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-350 font-bold">{mod.fullName}</span>
                      <span className="text-[7px] bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded border border-emerald-100 dark:border-emerald-500/10 font-bold tracking-wide uppercase">Mod</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Event / Notices */}
              <div className="bg-white dark:bg-[#0b0f19] border border-slate-150 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl text-left select-none flex flex-col gap-4">
                <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5">
                  <Calendar size={12} className="text-indigo-550 dark:text-indigo-400" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Workspace Events</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-900 p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-[9px] font-bold font-mono text-[#04AA6D] dark:text-indigo-400">JULY 15, 6:00 PM</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-205 leading-snug">React 19 Hooks Masterclass</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-555 leading-normal mt-1">Live codebase reviews and deep dive with the core developers.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom spacer to prevent clipping and give proper margin/padding */}
        <div className="h-8 shrink-0" />

      </div>
    </div>
  );
};
export default CommunityDetails;
