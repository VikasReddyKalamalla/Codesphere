import { createSlice } from '@reduxjs/toolkit';
const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [] },
  reducers: {
    setNotifications: (state, action) => { state.items = action.payload; }
  }
});
export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
