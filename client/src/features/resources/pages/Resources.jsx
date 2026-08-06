import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Plus, Flame, Layers, FileText, Code, Video, BookOpen,
  Filter, Trophy, ArrowRight, RefreshCw, Bookmark, CheckCircle2
} from 'lucide-react';

import { ResourceSidebar } from '../components/ResourceSidebar.jsx';
import { ResourceRightSidebar } from '../components/ResourceRightSidebar.jsx';
import { ResourceCard } from '../components/ResourceCard.jsx';
import { CreateResourceModal } from '../components/CreateResourceModal.jsx';

import { socket } from '../../../socket/socket.js';

import {
  fetchResourcesThunk,
  fetchFeaturedResourcesThunk,
  fetchTrendingResourcesThunk,
  createResourceThunk
} from '../redux/resourceThunk.js';

import {
  selectFilteredResources,
  selectFeaturedResources,
  selectTrendingResources,
  selectActiveTab,
  selectActiveCategory,
  selectActiveResourceType,
  selectActiveDifficulty,
  selectPriceFilter,
  selectSearchQuery,
  selectUserBookmarks,
  selectUserHistory,
  selectCollections
} from '../redux/resourceSelectors.js';

import {
  setActiveTab,
  setActiveCategory,
  setActiveResourceType,
  setActiveDifficulty,
  setPriceFilter,
  setSearchQuery,
  toggleBookmark,
  resetFilters,
  setSelectedResource
} from '../redux/resourceSlice.js';

export const Resources = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredResources = useSelector(selectFilteredResources);
  const featuredResources = useSelector(selectFeaturedResources);
  const trendingResources = useSelector(selectTrendingResources);
  const activeTab = useSelector(selectActiveTab);
  const activeCategory = useSelector(selectActiveCategory);
  const activeResourceType = useSelector(selectActiveResourceType);
  const activeDifficulty = useSelector(selectActiveDifficulty);
  const priceFilter = useSelector(selectPriceFilter);
  const searchQuery = useSelector(selectSearchQuery);
  const userBookmarks = useSelector(selectUserBookmarks);
  const userHistory = useSelector(selectUserHistory);
  const collections = useSelector(selectCollections);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchResourcesThunk());
    dispatch(fetchFeaturedResourcesThunk());
    dispatch(fetchTrendingResourcesThunk());

    const handleResourceChanged = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'resource' || entity === 'all') {
        dispatch(fetchResourcesThunk());
        dispatch(fetchFeaturedResourcesThunk());
        dispatch(fetchTrendingResourcesThunk());
      }
    };

    socket.on('admin:data_changed', handleResourceChanged);
    socket.on('resource:changed', handleResourceChanged);

    return () => {
      socket.off('admin:data_changed', handleResourceChanged);
      socket.off('resource:changed', handleResourceChanged);
    };
  }, [dispatch]);

  const handleSelectResource = (resource) => {
    dispatch(setSelectedResource(resource));
    navigate(`/resources/${resource._id || resource.id}`);
  };

  const handleBookmark = (resource) => {
    dispatch(toggleBookmark(resource._id || resource.id));
  };

  const handleCreateSubmit = (newResourceData) => {
    dispatch(createResourceThunk(newResourceData));
  };

  const handleDownload = async (res) => {
    if (!res) return;
    const targetUrl = res.fileUrl || res.externalUrl || res.url;
    if (!targetUrl) {
      toast.error('No downloadable file or link available for this resource');
      return;
    }

    const loader = toast.loading(`Downloading ${res.title}...`);
    try {
      await apiClient.post(`/resources/${res._id || res.id}/download`);
      dispatch(fetchResourcesThunk());
    } catch (err) {
      // Continue download even if analytics call fails
    }

    const fullUrl = targetUrl.startsWith('http') || targetUrl.startsWith('data:')
      ? targetUrl
      : `http://localhost:5000${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('File download failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const extName = targetUrl.split('.').pop()?.split('?')[0] || '';
      const filename = targetUrl.split('/').pop() || `${res.title}.${extName || 'file'}`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success(`Successfully downloaded ${res.title}!`, { id: loader });
    } catch (err) {
      const link = document.createElement('a');
      link.href = fullUrl;
      link.target = '_blank';
      link.download = res.title || 'resource-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Download started for ${res.title}!`, { id: loader });
    }
  };

  const currentUser = useSelector((state) => state.auth?.user);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 pb-16 animate-fade-in">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 p-6 rounded-3xl backdrop-blur-md shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#04AA6D]/15 text-[#04AA6D] dark:text-emerald-400 border border-[#04AA6D]/30 uppercase">
                  VERIFIED KNOWLEDGE HUB
                </span>
                <span className="text-xs font-mono text-slate-400">• 120+ PDF & Source Code Archives</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Developer Knowledge & Resource Library
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
                Explore verified cheat sheets, PDF manuals, source code zip archives, and video tutorials published by CodeSphere.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 bg-[#04AA6D] hover:bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/30"
            >
              <Plus className="w-4 h-4" />
              Upload New Resource
            </button>
          )}
        </div>
      </div>

      {/* Fast Topic Filter Pills & Search Bar */}
      <div className="flex flex-col gap-3 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 p-3 rounded-2xl backdrop-blur-md z-10">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#04AA6D]" />
            <input
              type="text"
              placeholder="Search resources by title, technology (React 19, DSA, AI, Docker), author, or tags..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all font-mono"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => dispatch(resetFilters())}
              className="px-4 py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border border-slate-300 dark:border-slate-800"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Popular Quick Search Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar text-xs font-mono">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">Quick Topics:</span>
          {[
            { label: '🔥 React & Next.js', query: 'React' },
            { label: '⚡ DSA & LeetCode', query: 'DSA' },
            { label: '🤖 AI & ML Agents', query: 'AI' },
            { label: '📦 System Design', query: 'System' },
            { label: '🐳 Docker & DevOps', query: 'Docker' },
            { label: '💼 Interview Sheets', query: 'Interview' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => dispatch(setSearchQuery(item.query))}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                searchQuery === item.query
                  ? 'bg-[#04AA6D] text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout Body */}
      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* Left Sidebar */}
        <ResourceSidebar
          activeTab={activeTab}
          activeCategory={activeCategory}
          activeResourceType={activeResourceType}
          activeDifficulty={activeDifficulty}
          priceFilter={priceFilter}
          onTabChange={(tab) => dispatch(setActiveTab(tab))}
          onCategoryChange={(cat) => dispatch(setActiveCategory(cat))}
          onTypeChange={(type) => dispatch(setActiveResourceType(type))}
          onDifficultyChange={(diff) => dispatch(setActiveDifficulty(diff))}
          onPriceChange={(price) => dispatch(setPriceFilter(price))}
          onReset={() => dispatch(resetFilters())}
        />

        {/* Center Content Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#04AA6D]" />
              <span className="capitalize">
                {activeTab === 'explore' && `Found ${filteredResources.length} Programming Resources`}
                {activeTab === 'trending' && `Trending Knowledge Items (${trendingResources.length})`}
                {activeTab === 'bookmarks' && `Bookmarked Resources (${userBookmarks.length})`}
                {activeTab === 'history' && `Recently Viewed (${userHistory.length})`}
                {activeTab === 'collections' && `Playlists & Resource Kits (${collections.length})`}
              </span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono capitalize">
              Filter: {activeCategory !== 'all' ? activeCategory : 'All Topics'}
            </span>
          </div>

          {/* Tab & Featured Content logic */}
          {(() => {
            if (activeTab === 'collections') {
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collections.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => dispatch(setActiveCategory('all'))}
                      className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D] cursor-pointer transition-all flex flex-col gap-2 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-[#04AA6D] uppercase">{c.icon || 'Kit'}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-mono font-bold px-2 py-0.5 rounded-md">{c.count} Resources</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{c.title}</h4>
                    </div>
                  ))}
                </div>
              );
            }

            const isExplore = activeTab === 'explore';
            const showFeatured = isExplore && featuredResources.length > 0 && !searchQuery && activeCategory === 'all' && activeResourceType === 'all' && activeDifficulty === 'all';
            const featuredItems = showFeatured ? featuredResources.slice(0, 2) : [];
            const featuredIds = new Set(featuredItems.map(r => String(r._id || r.id)));

            let baseItems = filteredResources;
            if (activeTab === 'trending') {
              baseItems = trendingResources.length > 0
                ? trendingResources
                : [...filteredResources].sort((a, b) => (b.views || 0) - (a.views || 0));
            } else if (activeTab === 'bookmarks') {
              const bSet = new Set(userBookmarks.map(String));
              baseItems = filteredResources.filter(r => bSet.has(String(r._id || r.id)));
            } else if (activeTab === 'history') {
              baseItems = userHistory;
            }

            const mainGridResources = baseItems.filter(r => !featuredIds.has(String(r._id || r.id)));

            return (
              <>
                {showFeatured && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#04AA6D] dark:text-emerald-400 uppercase tracking-wider font-mono">
                      <Flame className="w-4 h-4" />
                      Featured Knowledge Items
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {featuredItems.map((res) => (
                        <ResourceCard
                          key={String(res._id || res.id)}
                          resource={res}
                          isBookmarked={userBookmarks.map(String).includes(String(res._id || res.id))}
                          onSelect={handleSelectResource}
                          onBookmark={handleBookmark}
                          onDownload={handleDownload}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Resource Grid */}
                {mainGridResources.length === 0 && !showFeatured ? (
                  <div className="p-12 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-3xl flex flex-col items-center gap-3">
                    <Layers className="w-12 h-12 text-slate-400 dark:text-slate-600" />
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-200">No resources found</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeTab === 'bookmarks'
                        ? 'You have not bookmarked any resources yet.'
                        : activeTab === 'history'
                        ? 'You have not viewed any resources recently.'
                        : 'Try adjusting your topic, resource format, or difficulty filter.'}
                    </p>
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="mt-2 px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mainGridResources.map((res) => (
                      <ResourceCard
                        key={String(res._id || res.id)}
                        resource={res}
                        isBookmarked={userBookmarks.map(String).includes(String(res._id || res.id))}
                        onSelect={handleSelectResource}
                        onBookmark={handleBookmark}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Right Sidebar */}
        <ResourceRightSidebar
          resources={filteredResources}
          history={userHistory}
          onSelectResource={handleSelectResource}
        />
      </div>

      {/* Create Resource Modal */}
      {isCreateModalOpen && (
        <CreateResourceModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
};
export default Resources;
