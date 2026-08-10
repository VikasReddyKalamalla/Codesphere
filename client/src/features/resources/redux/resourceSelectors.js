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

const matchCategory = (res, category) => {
  if (!category || category === 'all') return true;
  if (!res) return false;

  const catObj = res.category;
  const catName = (typeof catObj === 'object' && catObj ? catObj.name : String(catObj || '')).toLowerCase();
  const catSlug = (typeof catObj === 'object' && catObj ? catObj.slug : String(catObj || '')).toLowerCase();
  const c = category.toLowerCase();

  if (catObj?._id === category || res.category === category) return true;
  if (catName === c || catSlug === c) return true;

  if (c === 'fullstack') return catName.includes('full stack') || catName.includes('web') || catSlug.includes('full-stack');
  if (c === 'dsa') return catName.includes('dsa') || catName.includes('algorithm') || catSlug.includes('dsa');
  if (c === 'ai') return catName.includes('ai') || catName.includes('data science') || catName.includes('ml') || catSlug.includes('ai');
  if (c === 'system_design') return catName.includes('system design') || catSlug.includes('system-design');
  if (c === 'cloud') return catName.includes('cloud') || catName.includes('devops') || catSlug.includes('cloud');
  if (c === 'cybersecurity') return catName.includes('security') || catSlug.includes('security');
  if (c === 'placements') return catName.includes('interview') || catName.includes('placement') || catSlug.includes('placement');
  if (c === 'presentation') return res.resourceType === 'ppt' || catName.includes('presentation') || catName.includes('powerpoint');
  if (c === 'word_docs') return res.resourceType === 'word' || catName.includes('word') || catName.includes('doc');

  return false;
};

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
      const isCatMatch = matchCategory(res, category);
      const isTypeMatch = type === 'all' || res.resourceType === type;
      const isDiffMatch = difficulty === 'all' || res.difficulty === difficulty;
      const isPriceMatch = price === 'all' || (price === 'free' && !res.isPremium) || (price === 'premium' && res.isPremium);

      const q = search.toLowerCase().trim();
      const isSearchMatch =
        !q ||
        res.title?.toLowerCase().includes(q) ||
        res.description?.toLowerCase().includes(q) ||
        res.tags?.some((t) => String(t).toLowerCase().includes(q)) ||
        (typeof res.uploadedBy === 'object' && res.uploadedBy?.fullName?.toLowerCase().includes(q)) ||
        res.instructor?.toLowerCase().includes(q);

      return isCatMatch && isTypeMatch && isDiffMatch && isPriceMatch && isSearchMatch;
    });
  }
);
