import React from 'react';
import { Badge } from '../common/Badge.jsx';

export const RoleBadge = ({ role = 'Student', className = '' }) => {
  const norm = role.toLowerCase();
  const variant = norm === 'admin' ? 'danger' : norm === 'instructor' ? 'warning' : 'primary';
  return <Badge variant={variant} className={className}>{role}</Badge>;
};
