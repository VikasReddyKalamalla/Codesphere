import { fetchSandboxProjectsAPI } from '../services/sandboxAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './sandboxSlice.js';

export const fetchSandboxItemsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchSandboxProjectsAPI();
    dispatch(fetchSuccess(data?.data?.projects || []));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
