import React from 'react';
import { GlobeView } from '../components/GlobeView.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const GlobeEvents = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/events" className="self-start" />
      <GlobeView />
    </div>
  );
};
