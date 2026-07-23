import React from 'react';
import { ProgressChart } from '@components/charts/ProgressChart.jsx';

export const WeeklyProgress = () => {
  const benchmarks = [
    { label: 'Sandbox Tasks', value: 85, color: 'bg-emerald-500' },
    { label: 'Video Lectures', value: 60, color: 'bg-indigo-650' }
  ];
  return <ProgressChart data={benchmarks} />;
};
