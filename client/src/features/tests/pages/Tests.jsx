import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Plus, Flame, Layers, Trophy, Clock, Play, Award, HelpCircle,
  Filter, CheckCircle2, ShieldCheck, ArrowRight
} from 'lucide-react';

import { TestSidebar } from '../components/TestSidebar.jsx';
import { TestRightSidebar } from '../components/TestRightSidebar.jsx';
import { TestCard } from '../components/TestCard.jsx';
import { CreateTestModal } from '../components/CreateTestModal.jsx';

import {
  fetchTestsThunk,
  fetchLeaderboardThunk,
  fetchContestsThunk,
  createTestThunk
} from '../redux/testThunk.js';

import {
  selectFilteredTests,
  selectContests,
  selectLeaderboard,
  selectActiveTab,
  selectActiveCategory,
  selectActiveDifficulty,
  selectSearchQuery,
  selectUserBookmarks
} from '../redux/testSelectors.js';

import {
  setActiveTab,
  setActiveCategory,
  setActiveDifficulty,
  setSearchQuery,
  toggleTestBookmark,
  resetTestFilters,
  setSelectedTest,
  startAttemptSession
} from '../redux/testSlice.js';

export const Tests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredTests = useSelector(selectFilteredTests);
  const contests = useSelector(selectContests);
  const leaderboard = useSelector(selectLeaderboard);
  const activeTab = useSelector(selectActiveTab);
  const activeCategory = useSelector(selectActiveCategory);
  const activeDifficulty = useSelector(selectActiveDifficulty);
  const searchQuery = useSelector(selectSearchQuery);
  const userBookmarks = useSelector(selectUserBookmarks);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTestsThunk());
    dispatch(fetchLeaderboardThunk());
    dispatch(fetchContestsThunk());
  }, [dispatch]);

  const handleSelectTest = (test) => {
    dispatch(setSelectedTest(test));
    dispatch(startAttemptSession(test));
    navigate(`/tests/${test._id || test.id}/runner`);
  };

  const handleBookmark = (test) => {
    dispatch(toggleTestBookmark(test._id || test.id));
  };

  const handleCreateSubmit = (newTestData) => {
    dispatch(createTestThunk(newTestData));
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
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-[#04AA6D] dark:from-white dark:via-slate-200 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
              Developer Assessments & Placement Tests
            </h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Evaluate real-world programming skills, algorithmic complexity, system design, SQL proficiency, and interview readiness under timed exam conditions.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 active:scale-95 transition-all text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Assessment
          </button>
        )}
      </div>

      {/* Global Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900/80 p-2 rounded-2xl backdrop-blur-md z-10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#04AA6D]" />
          <input
            type="text"
            placeholder="Search assessments by title, technology (React, DSA, System Design, SQL), difficulty..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#04AA6D]/50 focus:border-[#04AA6D] rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {searchQuery && (
          <button
            onClick={() => dispatch(resetTestFilters())}
            className="px-4 py-2.5 bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Navigation & Filter Sidebar */}
        <TestSidebar
          activeTab={activeTab}
          activeCategory={activeCategory}
          activeDifficulty={activeDifficulty}
          onTabChange={(val) => dispatch(setActiveTab(val))}
          onCategoryChange={(val) => dispatch(setActiveCategory(val))}
          onDifficultyChange={(val) => dispatch(setActiveDifficulty(val))}
          onReset={() => dispatch(resetTestFilters())}
        />

        {/* Center Content Grid */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#04AA6D]" />
              <span>Found {filteredTests.length} Assessments</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono capitalize">
              Filter: {activeCategory !== 'all' ? activeCategory : 'All Tracks'}
            </span>
          </div>

          {/* Live Contests Rail */}
          {activeTab === 'explore' && contests.length > 0 && !searchQuery && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#04AA6D] dark:text-emerald-400 uppercase tracking-wider font-mono">
                <Flame className="w-4 h-4" />
                Live & Upcoming Coding Contests
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contests.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 hover:border-[#04AA6D]/50 flex flex-col justify-between gap-3 text-white shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase font-mono px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        {c.status}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{c.prize}</span>
                    </div>

                    <h3 className="font-extrabold text-sm text-slate-100">{c.title}</h3>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                      <span>{c.participants} Participants</span>
                      <button
                        onClick={() => navigate('/tests')}
                        className="px-3 py-1.5 rounded-xl bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        Enter Contest
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Grid */}
          {filteredTests.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-3xl flex flex-col items-center gap-3">
              <Trophy className="w-12 h-12 text-slate-400 dark:text-slate-600" />
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200">No assessments matched your search filters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your topic or difficulty filter.</p>
              <button
                onClick={() => dispatch(resetTestFilters())}
                className="mt-2 px-4 py-2 bg-[#04AA6D] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <TestCard
                  key={test._id || test.id}
                  test={test}
                  isBookmarked={userBookmarks.includes(test._id || test.id)}
                  onSelect={handleSelectTest}
                  onBookmark={handleBookmark}
                  onStart={handleSelectTest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <TestRightSidebar
          leaderboard={leaderboard}
        />
      </div>

      {/* Create Test Modal */}
      {isCreateModalOpen && (
        <CreateTestModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      )}
    </div>
  );
};
export default Tests;
