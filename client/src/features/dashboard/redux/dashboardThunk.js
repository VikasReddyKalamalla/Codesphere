import { fetchDashboardDataAPI } from '../services/dashboardAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './dashboardSlice.js';

export const fetchDashboardThunk = () => async (dispatch, getState) => {
  dispatch(fetchStart());
  const token = getState().auth?.token;
  try {
    const data = await fetchDashboardDataAPI(token);
    dispatch(fetchSuccess(data));
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to fetch dashboard';
    dispatch(fetchFailure(msg));
  }
};
