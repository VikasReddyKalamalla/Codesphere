import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { IconButton } from '@components/common/IconButton.jsx';

export const SessionControls = ({ isMuted, onToggleMute, onLeave }) => {
  return (
    <div className="flex gap-4 justify-center py-4 bg-slate-950 rounded-xl max-w-sm mx-auto shadow-md">
      <IconButton
        icon={isMuted ? MicOff : Mic}
        variant={isMuted ? 'danger' : 'secondary'}
        onClick={onToggleMute}
        className="rounded-full text-white"
        aria-label="Toggle microphone state"
      />
      <IconButton
        icon={Video}
        variant="secondary"
        className="rounded-full text-white"
        aria-label="Toggle camera stream"
      />
      <IconButton
        icon={PhoneOff}
        variant="danger"
        onClick={onLeave}
        className="rounded-full text-white"
        aria-label="Leave meeting call"
      />
    </div>
  );
};
