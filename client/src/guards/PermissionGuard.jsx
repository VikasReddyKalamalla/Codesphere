import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PermissionGuard({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
