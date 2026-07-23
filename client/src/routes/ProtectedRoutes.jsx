import React from 'react';
import { Outlet } from 'react-router-dom';
import RouteGuard from './RouteGuard.jsx';

/**
 * ProtectedRoutes — wraps all JWT-guarded routes.
 *
 * Usage in AppRoutes:
 *   <Route element={<ProtectedRoutes isAuthenticated={!!user} />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * Props are read from Redux store in the real implementation;
 * placeholder props shown here for scaffolding.
 */
const ProtectedRoutes = ({ isAuthenticated = false }) => {
  return (
    <RouteGuard isAuthenticated={isAuthenticated}>
      <Outlet />
    </RouteGuard>
  );
};

export default ProtectedRoutes;
