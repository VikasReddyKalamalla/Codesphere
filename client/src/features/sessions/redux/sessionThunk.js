import * as api from '../services/sessionAPI.js';
import {
  fetchStart,
  fetchFailure,
  fetchSessionsSuccess,
  fetchMySessionsSuccess,
  fetchCertificatesSuccess,
  setCurrentSessionSuccess,
  setInteractivityData,
} from './sessionSlice.js';

export const fetchSessionsThunk = (query) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.fetchSessionsAPI(query);
    dispatch(fetchSessionsSuccess(data.sessions || data));
  } catch (err) {
    dispatch(fetchFailure(err.message || 'Failed to fetch sessions'));
  }
};

export const fetchMySessionsThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.fetchMySessionsAPI();
    dispatch(fetchMySessionsSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message || 'Failed to fetch registered sessions'));
  }
};

export const fetchCertificatesThunk = () => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.getMyCertificatesAPI();
    dispatch(fetchCertificatesSuccess(data));
  } catch (err) {
    dispatch(fetchFailure(err.message || 'Failed to fetch certificates'));
  }
};

export const getSessionByIdThunk = (id) => async (dispatch) => {
  dispatch(fetchStart());
  try {
    const data = await api.getSessionByIdAPI(id);
    dispatch(setCurrentSessionSuccess(data));

    // Fetch active session's resources, questions, polls, quizzes, recordings
    const [questions, polls, quizzes, resources, recordings] = await Promise.all([
      api.getQuestionsAPI(id).catch(() => []),
      api.getPollsAPI(id).catch(() => []),
      api.getQuizzesAPI(id).catch(() => []),
      api.getResourcesAPI(id).catch(() => []),
      api.getRecordingsAPI(id).catch(() => []),
    ]);

    dispatch(setInteractivityData({
      questions,
      polls,
      quizzes,
      resources,
      recordings,
    }));
  } catch (err) {
    dispatch(fetchFailure(err.message || 'Failed to fetch session details'));
  }
};

export const registerSessionThunk = (id) => async (dispatch) => {
  try {
    await api.registerForSessionAPI(id);
    dispatch(getSessionByIdThunk(id));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

export const cancelRegistrationThunk = (id) => async (dispatch) => {
  try {
    await api.cancelRegistrationAPI(id);
    dispatch(getSessionByIdThunk(id));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

export const checkInThunk = (id) => async (dispatch) => {
  try {
    const attendance = await api.checkInAPI(id);
    dispatch(setInteractivityData({ attendance }));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};

export const checkOutThunk = (id) => async (dispatch) => {
  try {
    const attendance = await api.checkOutAPI(id);
    dispatch(setInteractivityData({ attendance }));
  } catch (err) {
    dispatch(fetchFailure(err.message));
  }
};
