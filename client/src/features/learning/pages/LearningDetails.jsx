import React from 'react';
import { useParams } from 'react-router-dom';
import { Curriculum } from '../components/Curriculum.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const LearningDetails = () => {
  const { courseId } = useParams();

  const mockModules = [
    {
      title: 'Module 1: Introduction structures',
      lessonsCount: 3,
      lessons: [
        { id: 'l1', title: 'Syllabus guidelines and tools', duration: 12, type: 'video' },
        { id: 'l2', title: 'Introduction to React Components', duration: 25, type: 'article' },
        { id: 'l3', title: 'First React Code', duration: 20, type: 'code' }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex justify-between items-center gap-4">
        <BackButton fallbackPath="/learning" />
      </div>

      <div>
        <span className="text-[10px] font-bold text-indigo-500 uppercase">Interactive Course Syllabus</span>
        <h3 className="text-base font-bold text-slate-850 dark:text-white mt-1">Vite & React Masterclass</h3>
      </div>

      <Curriculum modules={mockModules} courseId={courseId} />
    </div>
  );
};
