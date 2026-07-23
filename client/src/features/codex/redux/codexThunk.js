import { fetchWorkspacesAPI } from '../services/codexAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './codexSlice.js';

export const fetchWorkspacesThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchWorkspacesAPI();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
