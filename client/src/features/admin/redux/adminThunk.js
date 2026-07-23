import { fetchAdminStatsAPI } from '../services/adminAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './adminSlice.js';

export const fetchAdminStatsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchAdminStatsAPI();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
