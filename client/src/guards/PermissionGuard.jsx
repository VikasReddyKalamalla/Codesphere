import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUser } from '../features/auth/utils/authHelpers';

export default function PermissionGuard({ children, requiredRole }) {
  const user = getUser() || {};
  if (user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
