import React from 'react';
import { AnalyticsCharts } from '../components/AnalyticsCharts.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Analytics = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <AnalyticsCharts />
    </div>
  );
};
