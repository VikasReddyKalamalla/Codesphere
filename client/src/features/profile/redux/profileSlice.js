import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  status: 'idle',
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.profile = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    updateSuccess: (state, action) => {
      state.profile = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchFailure, updateSuccess } = profileSlice.actions;
export default profileSlice.reducer;
