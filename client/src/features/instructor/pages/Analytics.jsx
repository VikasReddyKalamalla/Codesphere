import React from 'react';
import { AnalyticsChart } from '../components/AnalyticsChart.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Analytics = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/instructor" className="self-start" />
      <AnalyticsChart />
    </div>
  );
};
