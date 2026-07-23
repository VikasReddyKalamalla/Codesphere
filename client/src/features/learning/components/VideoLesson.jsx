import React from 'react';
import { VideoPlayer } from '@components/player/VideoPlayer.jsx';

export const VideoLesson = ({ lesson = {} }) => {
  return (
    <div className="flex flex-col gap-4">
      <VideoPlayer src={lesson.videoUrl} />
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{lesson.title}</h3>
        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mt-2">{lesson.summary}</p>
      </div>
    </div>
  );
};
