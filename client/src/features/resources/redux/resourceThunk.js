import {
  fetchResourcesAPI,
  fetchResourceByIdAPI,
  fetchFeaturedResourcesAPI,
  fetchTrendingResourcesAPI,
  fetchRecommendedResourcesAPI,
  createResourceAPI,
  toggleLikeAPI,
  rateResourceAPI,
  addCommentAPI,
  trackDownloadAPI,
} from '../services/resourceAPI.js';

import {
  setResources,
  setFeaturedResources,
  setTrendingResources,
  setRecommendedResources,
  setSelectedResource,
  addResourceItem,
} from './resourceSlice.js';

export const fetchResourcesThunk = (params) => async (dispatch) => {
  try {
    const res = await fetchResourcesAPI(params);
    const data = res.data?.resources || res.resources || res.data || res;
    if (Array.isArray(data)) {
      dispatch(setResources(data));
    }
  } catch (err) {
    console.error('Error fetching resources:', err);
  }
};

export const fetchFeaturedResourcesThunk = () => async (dispatch) => {
  try {
    const res = await fetchFeaturedResourcesAPI();
    const data = res.data || res;
    if (Array.isArray(data)) {
      dispatch(setFeaturedResources(data));
    }
  } catch (err) {
    console.error('Error fetching featured resources:', err);
  }
};

export const fetchTrendingResourcesThunk = () => async (dispatch) => {
  try {
    const res = await fetchTrendingResourcesAPI();
    const data = res.data || res;
    if (Array.isArray(data)) {
      dispatch(setTrendingResources(data));
    }
  } catch (err) {
    console.error('Error fetching trending resources:', err);
  }
};

export const fetchRecommendedResourcesThunk = () => async (dispatch) => {
  try {
    const res = await fetchRecommendedResourcesAPI();
    const data = res.data || res;
    if (Array.isArray(data)) {
      dispatch(setRecommendedResources(data));
    }
  } catch (err) {
    console.error('Error fetching recommended resources:', err);
  }
};

export const createResourceThunk = (payload) => async (dispatch) => {
  try {
    const res = await createResourceAPI(payload);
    const newResource = res.data || res;
    dispatch(addResourceItem(newResource));
    return newResource;
  } catch (err) {
    console.error('Error creating resource:', err);
    throw err;
  }
};

export const fetchResourceByIdThunk = (id) => async (dispatch) => {
  try {
    const res = await fetchResourceByIdAPI(id);
    const resource = res.data || res;
    dispatch(setSelectedResource(resource));
    return resource;
  } catch (err) {
    console.error('Error fetching resource by id:', err);
  }
};
