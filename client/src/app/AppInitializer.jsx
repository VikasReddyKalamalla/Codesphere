import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authSuccess } from '@features/auth/redux/authSlice.js';
import { getToken, getUser, isAuthValid, removeToken, removeUser } from '@features/auth/utils/authHelpers.js';

export const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  // Synchronously check if we have a valid stored session.
  const [initialized] = useState(() => {
    if (!isAuthValid()) {
      removeToken();
      removeUser();
      return { ready: true, token: null, user: null };
    }
    const token = getToken();
    const user = getUser();
    return { ready: true, token, user };
  });

  useEffect(() => {
    if (initialized.token && initialized.user) {
      dispatch(authSuccess({ token: initialized.token, user: initialized.user }));
    }
  }, [dispatch, initialized]);

  // Always render children — no delay, no loading screen flash.
  // Auth state is synchronously available from localStorage via initialState in authSlice.
  return children;
};
export default AppInitializer;
