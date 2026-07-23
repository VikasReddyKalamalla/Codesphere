import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice.js';
import dashboardReducer from '../features/dashboard/redux/dashboardSlice.js';
import learningReducer from '../features/learning/redux/learningSlice.js';
import resourceReducer from '../features/resources/redux/resourceSlice.js';
import communityReducer from '../features/communities/redux/communitySlice.js';
import sessionReducer from '../features/sessions/redux/sessionSlice.js';
import eventReducer from '../features/events/redux/eventSlice.js';
import codexReducer from '../features/codex/redux/codexSlice.js';
import sandboxReducer from '../features/sandbox/redux/sandboxSlice.js';
import testReducer from '../features/tests/redux/testSlice.js';
import profileReducer from '../features/profile/redux/profileSlice.js';
import instructorReducer from '../features/instructor/redux/instructorSlice.js';
import adminReducer from '../features/admin/redux/adminSlice.js';
import notificationReducer from './slices/notificationSlice.js';
import subscriptionReducer from './slices/subscriptionSlice.js';
import settingsReducer from './slices/settingsSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  learning: learningReducer,
  resources: resourceReducer,
  communities: communityReducer,
  sessions: sessionReducer,
  events: eventReducer,
  codex: codexReducer,
  sandbox: sandboxReducer,
  tests: testReducer,
  profile: profileReducer,
  notifications: notificationReducer,
  subscription: subscriptionReducer,
  instructor: instructorReducer,
  admin: adminReducer,
  settings: settingsReducer,
});

export default rootReducer;
