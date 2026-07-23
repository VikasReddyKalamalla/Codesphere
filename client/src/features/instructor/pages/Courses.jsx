import React from 'react';
import { CourseCard } from '../components/CourseCard.jsx';
import { PublishCourse } from '../components/PublishCourse.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Courses = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <BackButton fallbackPath="/instructor" className="self-start" />
      <div className="flex justify-between items-center gap-4 select-none">
        <h3 className="text-base font-bold text-slate-850 dark:text-white">Active courses catalogs</h3>
        <PublishCourse />
      </div>
      <CourseCard course={{ title: 'Python System Compilers masterclass' }} />
    </div>
  );
};
