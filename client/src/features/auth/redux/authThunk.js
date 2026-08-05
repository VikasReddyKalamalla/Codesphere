import { loginAPI, registerAPI, fetchCurrentUserAPI } from '../services/authAPI.js';
import { authStart, authSuccess, authFailure, logout as logoutAction } from './authSlice.js';
import { saveToken, saveUser, removeToken, removeUser } from '../utils/authHelpers.js';

export const loginThunk = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await loginAPI(credentials);
    const dataObj = response?.data || response;
    const token = dataObj?.token || response?.token;
    const user = dataObj?.user || response?.user;
    if (token && user) {
      removeToken();
      removeUser();
      saveToken(token);
      saveUser(user);
      dispatch(authSuccess({ user, token }));
      return { token, user };
    }
    throw new Error(response?.message || 'Login failed');
  } catch (err) {
    const msg = err.message || err.data?.message || 'Login failed';
    dispatch(authFailure(msg));
    return Promise.reject(err);
  }
};

export const registerThunk = (regData) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await registerAPI(regData);
    const dataObj = response?.data || response;
    const token = dataObj?.token || response?.token;
    const user = dataObj?.user || response?.user;
    if (token && user) {
      removeToken();
      removeUser();
      saveToken(token);
      saveUser(user);
      dispatch(authSuccess({ user, token }));
      return { token, user };
    }
    throw new Error(response?.message || 'Registration failed');
  } catch (err) {
    const msg = err.message || err.data?.message || 'Registration failed';
    dispatch(authFailure(msg));
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
