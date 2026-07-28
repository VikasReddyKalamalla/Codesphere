import { loginAPI, registerAPI, fetchCurrentUserAPI } from '../services/authAPI.js';
import { authStart, authSuccess, authFailure, logout as logoutAction } from './authSlice.js';
import { saveToken, saveUser, removeToken, removeUser } from '../utils/authHelpers.js';

export const loginThunk = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await loginAPI(credentials);
    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);
    dispatch(authSuccess({ user, token }));
    return { token, user }; // Return unwrapped data for the caller
  } catch (err) {
    const msg = err.message || err.data?.message || 'Login failed';
    dispatch(authFailure(msg));
    // Return a rejected promise with the normalized error
    return Promise.reject(err);
  }
};

export const registerThunk = (regData) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await registerAPI(regData);
    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);
    dispatch(authSuccess({ user, token }));
    return { token, user }; // Return unwrapped data for the caller
  } catch (err) {
    const msg = err.message || err.data?.message || 'Registration failed';
    dispatch(authFailure(msg));
    // Return a rejected promise with the normalized error
    return Promise.reject(err);
  }
};

export const fetchCurrentUserThunk = () => async (dispatch, getState) => {
  try {
    const response = await fetchCurrentUserAPI();
    const payload = response.data?.data || response.data || response;
    const user = (payload && payload._id) ? payload : (payload?.user || payload);
    const existingToken = getState().auth?.token || getToken();
    if (user && user._id) {
      saveUser(user);
      dispatch(authSuccess({ user, token: existingToken }));
    }
  } catch (err) {
    console.warn('[Auth] Failed to refresh current user:', err.message);
  }
};

export const logoutThunk = () => (dispatch) => {
  removeToken();
  removeUser();
  dispatch(logoutAction());
};
