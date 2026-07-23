import React from 'react';
import { Button } from '@components/common/Button.jsx';
import { Trash2 } from 'lucide-react';

export const DeleteNotification = ({ onClick }) => {
  return (
    <Button variant="ghost" size="sm" icon={Trash2} onClick={onClick} className="text-rose-500">
      Clear all
    </Button>
  );
};
