import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  featuredItems: [],
  trendingItems: [],
  recommendedItems: [],
  selectedResource: null,
  userBookmarks: [],
  userHistory: [],
  collections: [],
  activeTab: 'explore', // explore, trending, categories, collections, bookmarks, downloads, history
  activeCategory: 'all',
  activeResourceType: 'all',
  activeDifficulty: 'all',
  searchQuery: '',
  priceFilter: 'all',
  status: 'idle',
  error: null,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setResources: (state, action) => {
      const list = Array.isArray(action.payload) ? action.payload : [];
      const seen = new Set();
      state.items = list.filter((r) => {
        const id = String(r._id || r.id || r.title);
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    },
    setFeaturedResources: (state, action) => {
      state.featuredItems = action.payload;
    },
    setTrendingResources: (state, action) => {
      state.trendingItems = action.payload;
    },
    setRecommendedResources: (state, action) => {
      state.recommendedItems = action.payload;
    },
    setSelectedResource: (state, action) => {
      state.selectedResource = action.payload;
      if (action.payload) {
        const exists = state.userHistory.find(h => String(h._id || h.id) === String(action.payload._id || action.payload.id));
        if (!exists) {
          state.userHistory = [action.payload, ...state.userHistory].slice(0, 15);
        }
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveResourceType: (state, action) => {
      state.activeResourceType = action.payload;
    },
    setActiveDifficulty: (state, action) => {
      state.activeDifficulty = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
    toggleBookmark: (state, action) => {
      const id = String(action.payload);
      if (state.userBookmarks.includes(id)) {
        state.userBookmarks = state.userBookmarks.filter(bId => String(bId) !== id);
      } else {
        state.userBookmarks.push(id);
      }
    },
    addResourceItem: (state, action) => {
      if (!action.payload) return;
      const id = String(action.payload._id || action.payload.id || action.payload.title);
      state.items = state.items.filter(r => String(r._id || r.id || r.title) !== id);
      state.items.unshift(action.payload);
    },
    resetFilters: (state) => {
      state.activeCategory = 'all';
      state.activeResourceType = 'all';
      state.activeDifficulty = 'all';
      state.searchQuery = '';
      state.priceFilter = 'all';
    },
  },
});

export const {
  setResources,
  setFeaturedResources,
  setTrendingResources,
  setRecommendedResources,
  setSelectedResource,
  setActiveTab,
  setActiveCategory,
  setActiveResourceType,
  setActiveDifficulty,
  setSearchQuery,
  setPriceFilter,
  toggleBookmark,
  addResourceItem,
  resetFilters,
} = resourceSlice.actions;

export default resourceSlice.reducer;
