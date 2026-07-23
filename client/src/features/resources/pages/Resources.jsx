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

  const currentUser = useSelector((state) => state.auth?.user);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 pb-16 animate-fade-in">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#04AA6D] to-teal-600 shadow-lg shadow-emerald-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Developer Knowledge & Resource Library
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Discover verified PDF notes, system design cheat sheets, code boilerplates, video tutorials, and placement materials.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 active:scale-95 transition-all text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Publish Resource
          </button>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 p-2 rounded-2xl backdrop-blur-md z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#04AA6D]" />
          <input
            type="text"
            placeholder="Search resources by title, technology (React 19, DSA, AI, Docker), author, or tags..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Navigation & Filter Sidebar */}
        <ResourceSidebar
          activeTab={activeTab}
          activeCategory={activeCategory}
          activeResourceType={activeResourceType}
          activeDifficulty={activeDifficulty}
          priceFilter={priceFilter}
          onTabChange={(val) => dispatch(setActiveTab(val))}
          onCategoryChange={(val) => dispatch(setActiveCategory(val))}
          onTypeChange={(val) => dispatch(setActiveResourceType(val))}
          onDifficultyChange={(val) => dispatch(setActiveDifficulty(val))}
          onPriceChange={(val) => dispatch(setPriceFilter(val))}
          onReset={() => dispatch(resetFilters())}
        />

        {/* Center Content Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#04AA6D]" />
              <span>Found {filteredResources.length} Programming Resources</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono capitalize">
              Filter: {activeCategory !== 'all' ? activeCategory : 'All Topics'}
            </span>
          </div>

          {/* Featured Rail on Explore tab */}
          {activeTab === 'explore' && featuredResources.length > 0 && !searchQuery && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#04AA6D] dark:text-emerald-400 uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4" />
                Featured Knowledge Items
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredResources.slice(0, 2).map((res) => (
                  <ResourceCard
                    key={res._id || res.id}
                    resource={res}
                    isBookmarked={userBookmarks.includes(res._id || res.id)}
                    onSelect={handleSelectResource}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Resource Grid / List */}
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-3xl flex flex-col items-center gap-3">
              <Layers className="w-12 h-12 text-slate-400 dark:text-slate-600" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200">No resources matched your search filters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your topic, resource format, or difficulty filter.</p>
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-2 px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res._id || res.id}
                  resource={res}
                  isBookmarked={userBookmarks.includes(res._id || res.id)}
                  onSelect={handleSelectResource}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <ResourceRightSidebar
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
