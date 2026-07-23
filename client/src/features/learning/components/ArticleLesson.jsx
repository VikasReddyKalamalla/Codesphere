import React from 'react';

export const ArticleLesson = ({ lesson = {} }) => {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto py-4">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lesson.title}</h2>
      <div className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed space-y-4">
        {lesson.content ? (
          <p className="whitespace-pre-wrap">{lesson.content}</p>
        ) : (
          <p>No content provided for this article lecture.</p>
        )}
      </div>
    </div>
  );
};
