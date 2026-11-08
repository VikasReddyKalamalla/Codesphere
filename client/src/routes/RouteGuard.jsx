import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { isAuthValid } from '@features/auth/utils/authHelpers.js';
import ROUTES from './RouteConstants.js';

/**
 * RouteGuard — redirects unauthenticated users to /login.
 * Strictly verifies Redux auth state, current user profile,
 * and valid non-expired JWT storage session.
 */
const RouteGuard = ({
  isAuthenticated: propIsAuth,
  children,
  redirectTo = ROUTES.LOGIN,
}) => {
  const location = useLocation();
  const reduxIsAuth = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const allowed = (propIsAuth !== undefined ? propIsAuth : reduxIsAuth) && !!user && isAuthValid();

  if (!allowed) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default RouteGuard;
