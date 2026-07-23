import { fetchInstructorStatsAPI } from '../services/instructorAPI.js';
import { fetchStart, fetchSuccess, fetchFailure } from './instructorSlice.js';

export const fetchInstructorStatsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchInstructorStatsAPI();
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
