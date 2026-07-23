import React from 'react';
import { ModerationQueue } from '../components/ModerationQueue.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Moderation = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <ModerationQueue />
    </div>
  );
};
