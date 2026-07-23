import {
  fetchTestsAPI,
  fetchTestDetailsAPI,
  fetchLeaderboardAPI,
  fetchContestsAPI,
  submitTestAttemptAPI,
  createTestAPI,
} from '../services/testAPI.js';

import {
  setTests,
  setContests,
  setLeaderboard,
  setSelectedTest,
  setLastAttemptResult,
  addTestItem,
} from './testSlice.js';

export const fetchTestsThunk = (params) => async (dispatch) => {
  try {
    const res = await fetchTestsAPI(params);
    const data = res.data?.tests || res.tests || res.data || res;
    if (Array.isArray(data)) {
      dispatch(setTests(data));
    }
  } catch (err) {
    console.error('Error fetching tests:', err);
  }
};

export const fetchLeaderboardThunk = () => async (dispatch) => {
  try {
    const res = await fetchLeaderboardAPI();
    const data = res.data || res;
    if (Array.isArray(data)) {
      dispatch(setLeaderboard(data));
    }
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
  }
};

export const fetchContestsThunk = () => async (dispatch) => {
  try {
    const res = await fetchContestsAPI();
    const data = res.data || res;
    if (Array.isArray(data)) {
      dispatch(setContests(data));
    }
  } catch (err) {
    console.error('Error fetching contests:', err);
  }
};

export const fetchTestByIdThunk = (id) => async (dispatch) => {
  try {
    const res = await fetchTestDetailsAPI(id);
    const test = res.data || res;
    dispatch(setSelectedTest(test));
    return test;
  } catch (err) {
    console.error('Error fetching test by id:', err);
  }
};

export const submitTestThunk = (id, attemptData) => async (dispatch) => {
  try {
    const res = await submitTestAttemptAPI(id, attemptData);
    const result = res.data || res;
    dispatch(setLastAttemptResult(result));
    return result;
  } catch (err) {
    console.error('Error submitting test attempt:', err);
    throw err;
  }
};

export const createTestThunk = (payload) => async (dispatch) => {
  try {
    const res = await createTestAPI(payload);
    const newTest = res.data || res;
    dispatch(addTestItem(newTest));
    return newTest;
  } catch (err) {
    console.error('Error creating test:', err);
    throw err;
  }
};
