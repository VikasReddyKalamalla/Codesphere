import { fetchSandboxProjectsAPI } from '../services/sandboxAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './sandboxSlice.js';

export const fetchSandboxItemsThunk = (params) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await fetchSandboxProjectsAPI(params);
    const payload = res?.data || res;
    const list = Array.isArray(payload) ? payload : (payload?.projects || payload?.data?.projects || payload?.data || []);
    dispatch(fetchSuccess(list));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
