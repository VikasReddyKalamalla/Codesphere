import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  status: 'idle',
  error: null
};

const instructorSlice = createSlice({
  name: 'instructor',
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

export const { fetchStart, fetchSuccess, fetchFailure } = instructorSlice.actions;
export default instructorSlice.reducer;
