import React from 'react';
import { Badge } from './Badge.jsx';

export const StatusBadge = ({
  status = 'pending',
  className = '',
  ...props
}) => {
  const normalized = status.toLowerCase();

  const config = {
    pending: { variant: 'warning', label: 'Pending' },
    active: { variant: 'success', label: 'Active' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
    cancelled: { variant: 'secondary', label: 'Cancelled' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
  };

  const item = config[normalized] || { variant: 'secondary', label: status };

  return (
    <Badge variant={item.variant} className={className} {...props}>
      {item.label}
    </Badge>
  );
};
