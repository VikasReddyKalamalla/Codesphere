import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authSuccess } from '@features/auth/redux/authSlice.js';
import { getToken, getUser } from '@features/auth/utils/authHelpers.js';
import LoadingScreen from './LoadingScreen.jsx';

export const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (token && user) {
      dispatch(authSuccess({ token, user }));
    }
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!initialized) {
    return <LoadingScreen />;
  }

  return children;
};
export default AppInitializer;
