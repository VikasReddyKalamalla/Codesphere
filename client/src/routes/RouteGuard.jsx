import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ROUTES from './RouteConstants.js';

/**
 * RouteGuard — redirects unauthenticated users to /login.
 * Checks both Redux state (prop) and localStorage as a fallback
 * so the guard works even before Redux rehydration completes.
 */
const RouteGuard = ({
  isAuthenticated,
  children,
  redirectTo = ROUTES.LOGIN,
}) => {
  const location = useLocation();

  // Also check localStorage directly as a fallback for first-load rehydration
  const tokenInStorage = !!localStorage.getItem(
    import.meta.env.VITE_JWT_STORAGE_KEY || 'codesphere_token'
  );

  const allowed = isAuthenticated || tokenInStorage;

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
