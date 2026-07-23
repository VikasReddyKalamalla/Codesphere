import React from 'react';
import { QuizLesson } from '../components/QuizLesson.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const QuizPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full items-center py-10">
      <BackButton fallbackPath="/learning" className="self-start ml-12" />
      <QuizLesson />
    </div>
  );
};
