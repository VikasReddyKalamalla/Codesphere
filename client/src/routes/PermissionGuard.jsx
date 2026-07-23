import React from 'react';
import { Navigate } from 'react-router-dom';
import ROUTES from './RouteConstants.js';

/**
 * PermissionGuard — role-based access control at the route level.
 *
 * Props:
 *   user             object   — authenticated user (must have `.role`)
 *   allowedRoles     string[] — roles permitted to access this route
 *   children         node     — protected content
 *   redirectTo       string   — where to send unauthorised users
 *
 * Usage:
 *   <PermissionGuard user={user} allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </PermissionGuard>
 */
const PermissionGuard = ({
  user,
  allowedRoles = [],
  children,
  redirectTo = ROUTES.DASHBOARD,
}) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PermissionGuard;
