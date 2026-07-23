import React from 'react';
import { BarChart } from '@components/charts/BarChart.jsx';

export const AnalyticsChart = () => {
  return <BarChart data={[{ label: 'Week 1', value: 30 }, { label: 'Week 2', value: 80 }]} />;
};
