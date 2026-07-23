import React from 'react';
import { ActivityFeed } from '../components/ActivityFeed.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Activity = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/profile" className="self-start" />
      <ActivityFeed logs={[{ time: '2h ago', message: 'Launched Python Playpen sandbox' }]} />
    </div>
  );
};
