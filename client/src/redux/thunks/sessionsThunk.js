import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSessionsData = createAsyncThunk(
  'sessions/fetchData',
  async (arg, { rejectWithValue }) => {
    try {
      // Mock data request or API call
      return { success: true, data: [] };
    } catch (err) {
      return rejectWithValue(err.message || 'Request failed');
    }
  }
);
