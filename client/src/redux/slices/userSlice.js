import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProfileThunk,
  updateProfileThunk,
  uploadAvatarThunk,
} from '../thunks/userThunks.js';

const initialState = {
  profile:   null,
  isLoading: false,
  error:     null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileThunk.pending,   (state) => { state.isLoading = true;  state.error = null; })
      .addCase(fetchProfileThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.profile   = payload;
      })
      .addCase(fetchProfileThunk.rejected,  (state, { payload }) => { state.isLoading = false; state.error = payload; })

      .addCase(updateProfileThunk.pending,   (state) => { state.isLoading = true;  state.error = null; })
      .addCase(updateProfileThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.profile   = payload;
      })
      .addCase(updateProfileThunk.rejected,  (state, { payload }) => { state.isLoading = false; state.error = payload; })

      .addCase(uploadAvatarThunk.fulfilled,  (state, { payload }) => {
        if (state.profile) state.profile.avatar = payload.avatar;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
