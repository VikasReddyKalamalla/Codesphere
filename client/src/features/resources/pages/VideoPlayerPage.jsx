import React from 'react';
import { VideoPlayer } from '../components/VideoPlayer.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const VideoPlayerPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/resources" className="self-start" />
      <VideoPlayer src="https://sample.mp4" />
    </div>
  );
};
