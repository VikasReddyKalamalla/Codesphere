import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { isAuthValid } from '@features/auth/utils/authHelpers.js';
import ROUTES from './RouteConstants.js';

/**
 * GuestGuard — prevents authenticated users from accessing guest-only pages.
 * Validates active session state and redirects logged-in users to their dashboard.
 */
const GuestGuard = ({ isAuthenticated: propIsAuth, user: propUser, children }) => {
  const reduxIsAuth = useSelector(selectIsAuthenticated);
  const reduxUser = useSelector(selectCurrentUser);

  const isAuth = (propIsAuth !== undefined ? propIsAuth : reduxIsAuth);
  const user = propUser || reduxUser;

  const loggedIn = Boolean(isAuth && user && isAuthValid());

  if (loggedIn) {
    const destination =
      user?.role === 'admin'      ? ROUTES.ADMIN_DASHBOARD :
      user?.role === 'instructor' ? ROUTES.INSTRUCTOR_DASHBOARD :
                                    ROUTES.DASHBOARD;
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default GuestGuard;
