import React from 'react';
import { LearningProgress } from '../components/LearningProgress.jsx';
import { WeeklyProgress } from '../components/WeeklyProgress.jsx';

export const DashboardAnalytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">Coding Progress Analytics</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LearningProgress />
        <WeeklyProgress />
      </div>
    </div>
  );
};
