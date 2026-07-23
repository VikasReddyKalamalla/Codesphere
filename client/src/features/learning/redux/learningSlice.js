import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  activeCourse: null,
  status: 'idle',
  error: null
};

const learningSlice = createSlice({
  name: 'learning',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.status = 'loading';
    },
    fetchSuccess: (state, action) => {
      state.status = 'succeeded';
      state.courses = action.payload;
    },
    fetchCourseSuccess: (state, action) => {
      state.status = 'succeeded';
      state.activeCourse = action.payload;
    },
    fetchFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    }
  }
});

export const { fetchStart, fetchSuccess, fetchCourseSuccess, fetchFailure } = learningSlice.actions;
export default learningSlice.reducer;
