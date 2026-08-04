import { fetchCoursesAPI, fetchCourseDetailsAPI } from '../services/learningAPI.js';
import { fetchStart, fetchSuccess, fetchCourseSuccess, fetchFailure } from './learningSlice.js';

export const fetchCoursesThunk = (params) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const res = await fetchCoursesAPI(params);
    const payload = res?.data || res;
    const list = Array.isArray(payload) ? payload : (payload?.paths || payload?.courses || payload?.data || []);
    dispatch(fetchSuccess(list));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

export const fetchCourseDetailsThunk = (courseId) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchCourseDetailsAPI(courseId);
    dispatch(fetchCourseSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
