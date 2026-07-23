import React from 'react';
import { Button } from '@components/common/Button.jsx';
import { Check } from 'lucide-react';

export const MarkAsRead = ({ onClick }) => {
  return (
    <Button variant="ghost" size="sm" icon={Check} onClick={onClick}>
      Mark all read
    </Button>
  );
};
