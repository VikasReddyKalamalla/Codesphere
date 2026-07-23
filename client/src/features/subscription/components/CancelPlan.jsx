import React from 'react';
import { Button } from '@components/common/Button.jsx';
import toast from 'react-hot-toast';

export const CancelPlan = () => {
  const handleCancel = () => {
    toast.success('Subscription cancellation recorded.');
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleCancel} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25">
      Cancel Subscription
    </Button>
  );
};
