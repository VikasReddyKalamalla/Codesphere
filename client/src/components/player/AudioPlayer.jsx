import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const AudioPlayer = ({ src, title = 'Audio Recording' }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm w-full max-w-md">
      <audio ref={audioRef} src={src} />
      <div className="flex items-center gap-3">
        <IconButton
          icon={isPlaying ? Pause : Play}
          variant="primary"
          onClick={togglePlay}
          className="rounded-full shadow"
          aria-label="Toggle audio playback"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[200px]">{title}</span>
          <span className="text-[10px] text-slate-400">Audio playback track</span>
        </div>
      </div>
      <Volume2 className="w-5 h-5 text-slate-400 shrink-0" />
    </div>
  );
};
