import { fetchWorkspacesAPI } from '../services/codexAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './codexSlice.js';

export const fetchWorkspacesThunk = (params) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await fetchWorkspacesAPI(params);
    const payload = res?.data || res;
    const list = Array.isArray(payload) ? payload : (payload?.workspaces || payload?.data || []);
    dispatch(fetchSuccess(list));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
