import React from 'react';
import { BarChart } from './BarChart.jsx';

export const RevenueChart = () => {
  const months = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 65 },
    { label: 'Mar', value: 55 },
    { label: 'Apr', value: 85 },
    { label: 'May', value: 70 },
    { label: 'Jun', value: 95 }
  ];
  return <BarChart data={months} />;
};
