import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  status: 'idle',
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.data = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchFailure } = dashboardSlice.actions;
export default dashboardSlice.reducer;
