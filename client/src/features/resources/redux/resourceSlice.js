import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  featuredItems: [],
  trendingItems: [],
  recommendedItems: [],
  selectedResource: null,
  userBookmarks: [],
  userHistory: [],
  collections: [
    { id: 'c1', title: 'React 19 & Next.js Architecture', count: 8, icon: 'Layout' },
    { id: 'c2', title: 'System Design Interview Cheatsheets', count: 12, icon: 'Layers' },
    { id: 'c3', title: 'Generative AI & LLM Boilerplates', count: 6, icon: 'Sparkles' }
  ],
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
      state.items = action.payload;
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
        const exists = state.userHistory.find(h => (h._id || h.id) === (action.payload._id || action.payload.id));
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
      const id = action.payload;
      if (state.userBookmarks.includes(id)) {
        state.userBookmarks = state.userBookmarks.filter(bId => bId !== id);
      } else {
        state.userBookmarks.push(id);
      }
    },
    addResourceItem: (state, action) => {
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
