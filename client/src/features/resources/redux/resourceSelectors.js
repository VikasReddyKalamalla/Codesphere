import { createSelector } from '@reduxjs/toolkit';

export const selectResourcesState = (state) => state.resources;
export const selectResourceItems = (state) => state.resources?.items || [];
export const selectFeaturedResources = (state) => state.resources?.featuredItems || [];
export const selectTrendingResources = (state) => state.resources?.trendingItems || [];
export const selectRecommendedResources = (state) => state.resources?.recommendedItems || [];
export const selectSelectedResource = (state) => state.resources?.selectedResource;
export const selectActiveTab = (state) => state.resources?.activeTab || 'explore';
export const selectActiveCategory = (state) => state.resources?.activeCategory || 'all';
export const selectActiveResourceType = (state) => state.resources?.activeResourceType || 'all';
export const selectActiveDifficulty = (state) => state.resources?.activeDifficulty || 'all';
export const selectSearchQuery = (state) => state.resources?.searchQuery || '';
export const selectPriceFilter = (state) => state.resources?.priceFilter || 'all';
export const selectUserBookmarks = (state) => state.resources?.userBookmarks || [];
export const selectUserHistory = (state) => state.resources?.userHistory || [];
export const selectCollections = (state) => state.resources?.collections || [];

export const selectFilteredResources = createSelector(
  [
    selectResourceItems,
    selectActiveCategory,
    selectActiveResourceType,
    selectActiveDifficulty,
    selectPriceFilter,
    selectSearchQuery,
  ],
  (items, category, type, difficulty, price, search) => {
    return items.filter((res) => {
      const matchCategory = category === 'all' || res.category?._id === category || res.category === category || res.subCategory === category;
      const matchType = type === 'all' || res.resourceType === type;
      const matchDifficulty = difficulty === 'all' || res.difficulty === difficulty;
      const matchPrice = price === 'all' || (price === 'free' && !res.isPremium) || (price === 'premium' && res.isPremium);

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        res.title?.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q) ||
        res.tags?.some((t) => t.toLowerCase().includes(q)) ||
        res.instructor?.toLowerCase().includes(q);

      return matchCategory && matchType && matchDifficulty && matchPrice && matchSearch;
    });
  }
);
