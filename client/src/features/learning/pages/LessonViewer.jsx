import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LessonSidebar } from '../components/LessonSidebar.jsx';
import { VideoLesson } from '../components/VideoLesson.jsx';
import { ArticleLesson } from '../components/ArticleLesson.jsx';
import { QuizLesson } from '../components/QuizLesson.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const [activeLesson, setActiveLesson] = useState({ id: lessonId, title: 'Active Lecture', type: 'video', videoUrl: 'https://sample.mp4' });

  const mockModules = [
    {
      title: 'Module 1: Intro concepts',
      lessons: [
        { id: 'l1', title: 'Syllabus guidelines and tools', duration: 12, type: 'video', videoUrl: 'https://sample.mp4' },
        { id: 'l2', title: 'Compilers setup', duration: 25, type: 'article' }
      ]
    }
  ];

  return (
    <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
      <LessonSidebar modules={mockModules} activeLesson={activeLesson} onLessonSelect={setActiveLesson} />
      <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] flex flex-col gap-5">
        <BackButton fallbackPath={`/learning/${courseId}`} className="self-start" />
        
        {activeLesson.type === 'video' ? (
          <VideoLesson lesson={activeLesson} />
        ) : activeLesson.type === 'quiz' ? (
          <QuizLesson lesson={activeLesson} />
        ) : (
          <ArticleLesson lesson={activeLesson} />
        )}
      </div>
    </div>
  );
};
