import { fetchCoursesAPI, fetchCourseDetailsAPI } from '../services/learningAPI.js';
import { fetchStart, fetchSuccess, fetchCourseSuccess, fetchFailure } from './learningSlice.js';

export const fetchCoursesThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await fetchCoursesAPI();
    dispatch(fetchSuccess(data));
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
