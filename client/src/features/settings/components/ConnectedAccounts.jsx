import React from 'react';
import { Button } from '@components/common/Button.jsx';

export const ConnectedAccounts = () => {
  return (
    <div className="flex justify-between items-center text-xs">
      <span>GitHub Repository Sync</span>
      <Button variant="secondary" size="sm">Connected</Button>
    </div>
  );
};
