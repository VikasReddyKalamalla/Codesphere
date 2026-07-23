import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  status: 'idle',
  error: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.stats = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchFailure } = adminSlice.actions;
export default adminSlice.reducer;
