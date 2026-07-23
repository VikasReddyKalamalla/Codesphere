import React from 'react';
import { Navigate } from 'react-router-dom';
import ROUTES from './RouteConstants.js';

/**
 * GuestGuard — prevents authenticated users from accessing guest-only pages.
 * Checks both Redux state and localStorage for consistency.
 */
const GuestGuard = ({ isAuthenticated, user, children }) => {
  const tokenInStorage = !!localStorage.getItem(
    import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token'
  );

  const loggedIn = isAuthenticated || tokenInStorage;

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
