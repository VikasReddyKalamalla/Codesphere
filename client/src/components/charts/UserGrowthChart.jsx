import React from 'react';
import { AreaChart } from './AreaChart.jsx';

export const UserGrowthChart = () => {
  const trend = [30, 45, 60, 50, 75, 90, 110, 140, 130, 170];
  return <AreaChart data={trend} />;
};
