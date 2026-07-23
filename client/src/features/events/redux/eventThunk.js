import {
  fetchEventsAPI,
  fetchGlobeMarkersAPI,
  fetchEventByIdAPI,
  registerEventAPI,
  cancelRegistrationAPI,
  bookmarkEventAPI,
  removeBookmarkAPI,
  fetchUserBookmarksAPI,
  fetchUserRegistrationsAPI,
  fetchAnalyticsSummaryAPI,
  fetchAiRecommendationsAPI,
  createEventAPI,
} from '../services/eventAPI.js';

import {
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
} from './eventSlice.js';

export const fetchEventsThunk = (params = {}) => async (dispatch) => {
  try {
    dispatch(setEventsLoading());
    const data = await fetchEventsAPI(params);
    dispatch(setEventsSuccess(data));
  } catch (err) {
    dispatch(setEventsFailure(err.message || 'Failed to fetch events'));
  }
};

export const fetchGlobeMarkersThunk = () => async (dispatch) => {
  try {
    const data = await fetchGlobeMarkersAPI();
    dispatch(setGlobeMarkersSuccess(data));
  } catch (err) {
    console.error('Failed to fetch globe markers:', err);
  }
};

export const fetchEventByIdThunk = (id) => async (dispatch) => {
  try {
    const data = await fetchEventByIdAPI(id);
    dispatch(setCurrentEventSuccess(data));
  } catch (err) {
    console.error('Failed to fetch event details:', err);
  }
};

export const toggleBookmarkThunk = (eventId, isCurrentlyBookmarked) => async (dispatch) => {
  try {
    dispatch(toggleBookmarkOptimistic(eventId));
    if (isCurrentlyBookmarked) {
      await removeBookmarkAPI(eventId);
    } else {
      await bookmarkEventAPI(eventId);
    }
  } catch (err) {
    // Revert optimistic toggle
    dispatch(toggleBookmarkOptimistic(eventId));
    console.error('Failed to toggle bookmark:', err);
  }
};

export const toggleRegistrationThunk = (eventId, isCurrentlyRegistered) => async (dispatch) => {
  try {
    dispatch(toggleRegistrationOptimistic(eventId));
    if (isCurrentlyRegistered) {
      await cancelRegistrationAPI(eventId);
    } else {
      await registerEventAPI(eventId);
    }
  } catch (err) {
    dispatch(toggleRegistrationOptimistic(eventId));
    console.error('Failed to toggle registration:', err);
  }
};

export const fetchUserMetadataThunk = () => async (dispatch) => {
  try {
    const [bookmarksRes, registrationsRes] = await Promise.allSettled([
      fetchUserBookmarksAPI(),
      fetchUserRegistrationsAPI()
    ]);

    if (bookmarksRes.status === 'fulfilled') {
      const val = bookmarksRes.value;
      const rawArr = Array.isArray(val) ? val : (val?.data?.bookmarks || val?.data || val?.bookmarks || []);
      const bIds = Array.isArray(rawArr) ? rawArr.map(b => b?.eventId?._id || b?.eventId || b?._id || b) : [];
      dispatch(setUserBookmarksSuccess(bIds));
    }
    if (registrationsRes.status === 'fulfilled') {
      const val = registrationsRes.value;
      const rawArr = Array.isArray(val) ? val : (val?.data?.registrations || val?.data || val?.registrations || []);
      const rIds = Array.isArray(rawArr) ? rawArr.map(r => r?.eventId?._id || r?.eventId || r?._id || r) : [];
      dispatch(setUserRegistrationsSuccess(rIds));
    }
  } catch (err) {
    console.error('Failed to fetch user event metadata:', err);
  }
};

export const fetchAnalyticsSummaryThunk = () => async (dispatch) => {
  try {
    const data = await fetchAnalyticsSummaryAPI();
    dispatch(setAnalyticsSummarySuccess(data));
  } catch (err) {
    console.error('Failed to fetch analytics summary:', err);
  }
};

export const fetchAiRecommendationsThunk = (tags) => async (dispatch) => {
  try {
    const data = await fetchAiRecommendationsAPI(tags);
    dispatch(setAiRecommendationsSuccess(data));
  } catch (err) {
    console.error('Failed to fetch AI recommendations:', err);
  }
};

export const createEventThunk = (eventData) => async (dispatch) => {
  const data = await createEventAPI(eventData);
  if (data) {
    dispatch(addEventOptimistic(data));
  }
  return data;
};
