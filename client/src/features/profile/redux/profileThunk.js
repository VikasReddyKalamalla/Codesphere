import { fetchProfileAPI, updateProfileAPI } from '../services/profileAPI.js';
import { fetchStart, fetchSuccess, fetchFailure, updateSuccess } from './profileSlice.js';

export const fetchProfileThunk = (userId) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchProfileAPI(userId);
    dispatch(fetchSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

export const updateProfileThunk = (profileData) => async (dispatch) => {
  try {
    const data = await updateProfileAPI(profileData);
    dispatch(updateSuccess(data));
    return data;
  } catch (err) {
    throw err;
  }
};
