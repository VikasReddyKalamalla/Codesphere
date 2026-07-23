import React from 'react';
import { Badge } from '../common/Badge.jsx';

export const PlanBadge = ({ plan = 'Free', className = '' }) => {
  const norm = plan.toLowerCase();
  const variant = norm === 'enterprise' ? 'danger' : norm === 'premium' ? 'warning' : 'secondary';
  return <Badge variant={variant} className={className}>{plan}</Badge>;
};
