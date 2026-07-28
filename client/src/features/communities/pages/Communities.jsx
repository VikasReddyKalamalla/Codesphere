import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Sparkles, Layers, MessageSquare, 
  HelpCircle, Compass, Users, Activity, Flame 
} from 'lucide-react';
import { 
  fetchCommunitiesThunk, 
  joinCommunityThunk, 
  leaveCommunityThunk 
} from '../redux/communityThunk.js';
import { updateCommunityMembership } from '../redux/communitySlice.js';
import { selectCommunities } from '../redux/communitySelectors.js';
import { CommunityCard } from '../components/CommunityCard.jsx';
import { TrendingTags } from '../components/TrendingTags.jsx';
import { CommunitySidebar } from '../components/CommunitySidebar.jsx';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { fetchCurrentUserThunk } from '@features/auth/redux/authThunk.js';
import { socket } from '../../../socket/socket.js';
import { isCommunityMember, getUserId } from '../utils/communityHelpers.js';

export const Communities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);
  const { items: communities, status, error } = useSelector(selectCommunities);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTag, setActiveTag] = useState(null);
  const [viewFilter, setViewFilter] = useState('all'); // 'all' or 'joined'

  useEffect(() => {
    dispatch(fetchCommunitiesThunk());
    dispatch(fetchCurrentUserThunk());

    const handleMembershipUpdate = (payload) => {
      if (payload && payload.communityId) {
        dispatch(updateCommunityMembership(payload));
        dispatch(fetchCommunitiesThunk());
      }
    };

    socket.on('community:membershipUpdated', handleMembershipUpdate);
    return () => {
      socket.off('community:membershipUpdated', handleMembershipUpdate);
    };
  }, [dispatch]);

  const handleJoinToggle = (communityId) => {
    const comm = communities.find(c => c._id === communityId);
    const isMember = isCommunityMember(comm, currentUser);

    if (isMember) {
      if (window.confirm(`Are you sure you want to leave ${comm?.name || 'this community'}?`)) {
        dispatch(leaveCommunityThunk(communityId));
      }
    } else {
      dispatch(joinCommunityThunk(communityId));
    }
  };

  // Category filter matcher
  const matchesCategoryFilter = (commCategory, selected) => {
    if (!selected || selected === 'All') return true;
    if (!commCategory) return false;
    const cat = commCategory.toLowerCase();
    const sel = selected.toLowerCase();

    if (cat === sel) return true;
    if (sel.includes('web') && (cat.includes('web') || cat.includes('programming') || cat.includes('frontend') || cat.includes('backend'))) return true;
    if (sel.includes('language') && (cat.includes('language') || cat.includes('programming') || cat.includes('general'))) return true;
    if (sel.includes('ai') && (cat.includes('ai') || cat.includes('data') || cat.includes('machine') || cat.includes('ml'))) return true;
    if (sel.includes('devops') && (cat.includes('devops') || cat.includes('cloud'))) return true;
    if (sel.includes('mobile') && cat.includes('mobile')) return true;
    if (sel.includes('open') && cat.includes('open')) return true;
    if (sel.includes('career') && (cat.includes('career') || cat.includes('job'))) return true;
    if (sel.includes('general') && cat.includes('general')) return true;

    return false;
  };

  // Filter logic
  const filteredCommunities = communities.filter((comm) => {
    const isMember = isCommunityMember(comm, currentUser);
    if (viewFilter === 'joined' && !isMember) return false;
    if (viewFilter === 'all' && isMember) return false;

    const matchesSearch = comm.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comm.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = matchesCategoryFilter(comm.category, selectedCategory);
    const matchesTag = !activeTag || comm.tags?.some(t => t.toLowerCase() === activeTag.toLowerCase());

    return matchesSearch && matchesCategory && matchesTag;
  });

  const joinedCount = communities.filter(c => isCommunityMember(c, currentUser)).length;
  const unjoinedCount = communities.filter(c => !isCommunityMember(c, currentUser)).length;

  return (
    <div className="bg-slate-50 dark:bg-[#080d1a] h-full flex-1 flex text-slate-700 dark:text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Left persistent sidebar */}
      <CommunitySidebar 
        selectedCategory={selectedCategory === 'All' ? null : selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat || 'All')}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar h-full">
        
        {/* Banner Cover Row - height matches sidebar header */}
        <div className="bg-white dark:bg-[#0b0f19]/30 border-b border-slate-200 dark:border-slate-800 px-6 flex justify-between items-center shrink-0 h-24">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl relative shadow-xs dark:shadow-xl">
              <Compass size={22} className="animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono flex items-center gap-2">
                <span>Explore Spaces</span>
                <span className="text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/30 text-[#04AA6D] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded uppercase">Discovery</span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Join specialized groups, share codebase show-offs, and debug together.</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/community/create')}
            className="bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold font-mono uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Launch Space</span>
          </button>
        </div>

        {/* Dashboard grid columns - unified 24px layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main lobby column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Search Input & View Filter Tabs */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm dark:shadow-xl flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search community spaces by name, tags, description..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-xs pl-10 pr-4 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-655 focus:border-[#04AA6D]"
                />
              </div>

              {/* All / Joined Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl shrink-0 border border-slate-200/80 dark:border-slate-800/80 items-center gap-1">
                <button
                  onClick={() => setViewFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewFilter === 'all'
                      ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>All Spaces</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                    viewFilter === 'all'
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200/70 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                  }`}>
                    {unjoinedCount}
                  </span>
                </button>

                <button
                  onClick={() => setViewFilter('joined')}
                  className={`px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewFilter === 'joined'
                      ? 'bg-[#04AA6D] text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span>Joined</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                    viewFilter === 'joined'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#04AA6D] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  }`}>
                    {joinedCount}
                  </span>
                </button>
              </div>
            </div>

            {/* List */}
            {status === 'loading' ? (
              <div className="text-center py-20 text-[10px] text-slate-400 dark:text-slate-550 uppercase tracking-widest font-mono font-bold">
                Fetching active guilds...
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#0b0f19]">
                <Compass className="w-8 h-8 text-slate-400 dark:text-slate-600 animate-spin" />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono font-bold">
                  {viewFilter === 'joined' ? 'You have not joined any spaces yet' : 'No communities matched filters'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-600">
                  {viewFilter === 'joined' ? 'Explore communities above and click Join to see them here!' : 'Try revising your search phrase or category sorting.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCommunities.map((item) => {
                  const isJoined = isCommunityMember(item, currentUser);
                  return (
                    <div 
                      key={item._id} 
                      onClick={() => navigate(`/community/${item._id}`)}
                      className="cursor-pointer"
                    >
                      <CommunityCard 
                        community={item} 
                        onJoinToggle={handleJoinToggle} 
                        isJoined={isJoined} 
                      />
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Right details column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <TrendingTags 
              communities={communities}
              activeTag={activeTag} 
              onTagClick={setActiveTag} 
            />

            {/* Points Streaks */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 rounded-xl">
                  <Flame size={16} className="fill-orange-500 dark:fill-orange-400" />
                </div>
                <div className="text-left">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono block">Streak Level</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{currentUser?.dayStreak || 1} Days Active</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#04AA6D] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded">
                +{currentUser?.achievementPoints || 100} XP
              </span>
            </div>

            {/* Activity Logs */}
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm dark:shadow-xl text-left">
              <div className="flex items-center gap-1.5 border-b border-slate-150 dark:border-slate-850 pb-2.5 mb-3.5">
                <Activity size={12} className="text-[#04AA6D] dark:text-emerald-400" />
                <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest font-mono">Recent Activities</span>
              </div>
              
              <div className="flex flex-col gap-3 font-mono text-[9px] text-slate-500 dark:text-slate-400 leading-normal uppercase">
                {communities.slice(0, 3).map((comm) => (
                  <div key={comm._id} className="flex flex-col gap-0.5 text-left border-b border-slate-100 dark:border-slate-850/60 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-700 dark:text-slate-300 font-bold truncate">{comm.name}</span>
                    <span>{comm.memberCount || 1} members • {comm.category || 'General'}</span>
                  </div>
                ))}
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
export default Communities;
