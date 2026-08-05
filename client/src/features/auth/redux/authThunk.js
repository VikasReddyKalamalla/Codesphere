import { loginAPI, registerAPI, googleAuthAPI, fetchCurrentUserAPI } from '../services/authAPI.js';
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

export const googleAuthThunk = (googleUser) => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await googleAuthAPI(googleUser);
    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);
    dispatch(authSuccess({ user, token }));
    return { token, user };
  } catch (err) {
    const msg = err.message || err.data?.message || 'Google authentication failed';
    dispatch(authFailure(msg));
    return Promise.reject(err);
  }
};

export const logoutThunk = () => (dispatch) => {
  removeToken();
  removeUser();
  dispatch(logoutAction());
};

