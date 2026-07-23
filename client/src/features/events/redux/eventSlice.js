import { createSlice } from '@reduxjs/toolkit';

const extractArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  if (Array.isArray(payload.events)) return payload.events;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && Array.isArray(payload.data.events)) return payload.data.events;
  if (payload.data && Array.isArray(payload.data.data)) return payload.data.data;
  return [];
};

const initialState = {
  items: [],
  globeMarkers: [],
  featuredEvents: [],
  trendingEvents: [],
  currentEvent: null,
  userRegistrations: [],
  userBookmarks: [],
  analyticsSummary: null,
  aiRecommendations: [],
  
  // Filters & State
  activeTab: 'globe', // 'globe', 'explore', 'hackathons', 'calendar', 'bookmarks', 'registrations', 'analytics', 'create'
  searchQuery: '',
  selectedEventType: 'all',
  selectedMode: 'all',
  selectedDifficulty: 'all',
  selectedCategory: 'all',
  priceFilter: 'all',
  
  status: 'idle',
  globeStatus: 'idle',
  error: null
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedEventType: (state, action) => {
      state.selectedEventType = action.payload;
    },
    setSelectedMode: (state, action) => {
      state.selectedMode = action.payload;
    },
    setSelectedDifficulty: (state, action) => {
      state.selectedDifficulty = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriceFilter: (state, action) => {
      state.priceFilter = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedEventType = 'all';
      state.selectedMode = 'all';
      state.selectedDifficulty = 'all';
      state.selectedCategory = 'all';
      state.priceFilter = 'all';
    },

    // Reducers for async operations
    setEventsLoading: (state) => {
      state.status = 'loading';
    },
    setEventsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.items = extractArray(action.payload);
    },
    setGlobeMarkersSuccess: (state, action) => {
      state.globeStatus = 'succeeded';
      state.globeMarkers = extractArray(action.payload);
    },
    setCurrentEventSuccess: (state, action) => {
      state.currentEvent = action.payload?.data || action.payload;
    },
    setUserRegistrationsSuccess: (state, action) => {
      state.userRegistrations = Array.isArray(action.payload) ? action.payload : [];
    },
    setUserBookmarksSuccess: (state, action) => {
      state.userBookmarks = Array.isArray(action.payload) ? action.payload : [];
    },
    setAnalyticsSummarySuccess: (state, action) => {
      state.analyticsSummary = action.payload?.data || action.payload;
    },
    setAiRecommendationsSuccess: (state, action) => {
      state.aiRecommendations = extractArray(action.payload);
    },
    toggleBookmarkOptimistic: (state, action) => {
      const eventId = action.payload;
      if (state.userBookmarks.includes(eventId)) {
        state.userBookmarks = state.userBookmarks.filter(id => id !== eventId);
      } else {
        state.userBookmarks.push(eventId);
      }
    },
    toggleRegistrationOptimistic: (state, action) => {
      const eventId = action.payload;
      if (state.userRegistrations.includes(eventId)) {
        state.userRegistrations = state.userRegistrations.filter(id => id !== eventId);
      } else {
        state.userRegistrations.push(eventId);
      }
    },
    addEventOptimistic: (state, action) => {
      const newEv = action.payload?.data || action.payload;
      if (newEv && newEv._id) {
        state.items.unshift(newEv);
        if (newEv.latitude && newEv.longitude) {
          state.globeMarkers.push({
            id: newEv._id,
            title: newEv.title,
            lat: newEv.latitude,
            lng: newEv.longitude,
            country: newEv.country,
            city: newEv.city,
            categoryColor: newEv.categoryColor || '#8B5CF6',
            eventType: newEv.eventType,
            registeredCount: 1,
          });
        }
      }
    },
    setEventsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const {
  setActiveTab,
  setSearchQuery,
  setSelectedEventType,
  setSelectedMode,
  setSelectedDifficulty,
  setSelectedCategory,
  setPriceFilter,
  resetFilters,
  setEventsLoading,
  setEventsSuccess,
  setGlobeMarkersSuccess,
  setCurrentEventSuccess,
  setUserRegistrationsSuccess,
  setUserBookmarksSuccess,
  setAnalyticsSummarySuccess,
  setAiRecommendationsSuccess,
  toggleBookmarkOptimistic,
  toggleRegistrationOptimistic,
  addEventOptimistic,
  setEventsFailure,
} = eventSlice.actions;

export default eventSlice.reducer;
