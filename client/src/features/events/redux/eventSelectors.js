import { createSelector } from '@reduxjs/toolkit';

export const selectEventsState = (state) => state.events || {};

export const selectEventsList = createSelector(
  [selectEventsState],
  (eventsState) => {
    const items = eventsState.items;
    if (Array.isArray(items)) return items;
    if (items && Array.isArray(items.events)) return items.events;
    if (items && Array.isArray(items.data)) return items.data;
    if (items && items.data && Array.isArray(items.data.events)) return items.data.events;
    return [];
  }
);

export const selectGlobeMarkers = createSelector(
  [selectEventsState],
  (eventsState) => {
    const markers = eventsState.globeMarkers;
    if (Array.isArray(markers)) return markers;
    if (markers && Array.isArray(markers.data)) return markers.data;
    return [];
  }
);

export const selectActiveTab = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.activeTab || 'globe'
);

export const selectSearchQuery = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.searchQuery || ''
);

export const selectSelectedCategory = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.selectedCategory || 'all'
);

export const selectSelectedEventType = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.selectedEventType || 'all'
);

export const selectSelectedMode = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.selectedMode || 'all'
);

export const selectSelectedDifficulty = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.selectedDifficulty || 'all'
);

export const selectPriceFilter = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.priceFilter || 'all'
);

export const selectCurrentEvent = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.currentEvent
);

export const selectUserBookmarks = createSelector(
  [selectEventsState],
  (eventsState) => Array.isArray(eventsState.userBookmarks) ? eventsState.userBookmarks : []
);

export const selectUserRegistrations = createSelector(
  [selectEventsState],
  (eventsState) => Array.isArray(eventsState.userRegistrations) ? eventsState.userRegistrations : []
);

export const selectAnalyticsSummary = createSelector(
  [selectEventsState],
  (eventsState) => eventsState.analyticsSummary
);

export const selectAiRecommendations = createSelector(
  [selectEventsState],
  (eventsState) => Array.isArray(eventsState.aiRecommendations) ? eventsState.aiRecommendations : []
);

export const selectFilteredEvents = createSelector(
  [
    selectEventsList,
    selectSearchQuery,
    selectSelectedCategory,
    selectSelectedEventType,
    selectSelectedMode,
    selectSelectedDifficulty,
    selectPriceFilter
  ],
  (events, query, category, type, mode, difficulty, price) => {
    const list = Array.isArray(events) ? events : [];
    return list.filter(ev => {
      if (!ev) return false;
      const matchesSearch = !query || 
        (ev.title && ev.title.toLowerCase().includes(query.toLowerCase())) ||
        (ev.description && ev.description.toLowerCase().includes(query.toLowerCase())) ||
        (ev.country && ev.country.toLowerCase().includes(query.toLowerCase())) ||
        (ev.city && ev.city.toLowerCase().includes(query.toLowerCase())) ||
        (ev.companyName && ev.companyName.toLowerCase().includes(query.toLowerCase())) ||
        (Array.isArray(ev.tags) && ev.tags.some(t => t && t.toLowerCase().includes(query.toLowerCase())));

      const matchesCategory = category === 'all' || 
        (ev.categoryName && ev.categoryName.toLowerCase() === category.toLowerCase()) || 
        (ev.category && (ev.category._id === category || ev.category === category));
        
      const matchesType = type === 'all' || ev.eventType === type;
      const matchesMode = mode === 'all' || ev.mode === mode;
      const matchesDiff = difficulty === 'all' || ev.difficulty === difficulty;
      const matchesPrice = price === 'all' || (price === 'free' ? ev.entryFee === 0 : ev.entryFee > 0);

      return matchesSearch && matchesCategory && matchesType && matchesMode && matchesDiff && matchesPrice;
    });
  }
);
