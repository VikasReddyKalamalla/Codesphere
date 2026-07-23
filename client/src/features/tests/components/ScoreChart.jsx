import React from 'react';
import { BarChart } from '@components/charts/BarChart.jsx';

export const ScoreChart = () => {
  const scores = [
    { label: 'Quiz 1', value: 80 },
    { label: 'Quiz 2', value: 95 },
    { label: 'Quiz 3', value: 70 }
  ];
  return <BarChart data={scores} />;
};
