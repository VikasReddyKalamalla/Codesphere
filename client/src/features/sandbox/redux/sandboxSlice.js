import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playpens: [],
  status: 'idle',
  error: null
};

const sandboxSlice = createSlice({
  name: 'sandbox',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.playpens = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchFailure } = sandboxSlice.actions;
export default sandboxSlice.reducer;
