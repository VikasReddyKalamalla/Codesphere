import React from 'react';
import { LineChart } from './LineChart.jsx';

export const LearningChart = () => {
  const stats = [20, 40, 30, 60, 80, 70, 95, 100];
  return <LineChart data={stats} />;
};
