import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSuccess } from '@features/auth/redux/authSlice.js';
import { getToken, getUser } from '@features/auth/utils/authHelpers.js';

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    const user  = getUser();
    if (token && user) {
      dispatch(authSuccess({ token, user }));
    }
  }, [dispatch]);

  return <>{children}</>;
}
