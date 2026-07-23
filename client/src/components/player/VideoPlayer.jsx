import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import { IconButton } from '../common/IconButton.jsx';

export const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group border border-slate-850 shadow-md">
      <video ref={videoRef} src={src} className="w-full h-full object-contain" onClick={togglePlay} />
      
      {/* Visual Overlay Bar on Hover */}
      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-3.5 flex items-center justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <IconButton
          icon={isPlaying ? Pause : Play}
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="text-white hover:bg-slate-800"
          aria-label="Toggle play pause state"
        />
        <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative">
          <div className="h-full bg-indigo-500 w-1/3" />
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="w-4.5 h-4.5 text-white" />
          <IconButton
            icon={Maximize}
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="text-white hover:bg-slate-800"
            aria-label="Fullscreen player viewport"
          />
        </div>
      </div>
    </div>
  );
};
