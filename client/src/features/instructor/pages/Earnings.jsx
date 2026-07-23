import React from 'react';
import { EarningsCard } from '../components/EarningsCard.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Earnings = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/instructor" className="self-start" />
      <EarningsCard />
    </div>
  );
};
