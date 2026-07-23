import { createSlice } from '@reduxjs/toolkit';
import { getUser, getToken, saveUser } from '../utils/authHelpers.js';

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    authFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveUser(state.user);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    }
  }
});

export const { authStart, authSuccess, authFailure, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
