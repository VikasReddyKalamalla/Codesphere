import { createSelector } from '@reduxjs/toolkit';

export const selectTestItems = (state) => state.tests?.items || [];
export const selectContests = (state) => state.tests?.contests || [];
export const selectLeaderboard = (state) => state.tests?.leaderboard || [];
export const selectSelectedTest = (state) => state.tests?.selectedTest;
export const selectActiveAttempt = (state) => state.tests?.activeAttempt;
export const selectLastAttemptResult = (state) => state.tests?.lastAttemptResult;
export const selectActiveTab = (state) => state.tests?.activeTab || 'explore';
export const selectActiveCategory = (state) => state.tests?.activeCategory || 'all';
export const selectActiveDifficulty = (state) => state.tests?.activeDifficulty || 'all';
export const selectSearchQuery = (state) => state.tests?.searchQuery || '';
export const selectUserBookmarks = (state) => state.tests?.userBookmarks || [];

export const selectFilteredTests = createSelector(
  [
    selectTestItems,
    selectActiveCategory,
    selectActiveDifficulty,
    selectSearchQuery,
  ],
  (items, category, difficulty, search) => {
    return items.filter((t) => {
      const matchCategory = category === 'all' || t.category?._id === category || t.category === category || t.technology?.toLowerCase().includes(category);
      const matchDifficulty = difficulty === 'all' || t.difficulty === difficulty;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.technology?.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q));

      return matchCategory && matchDifficulty && matchSearch;
    });
  }
);
