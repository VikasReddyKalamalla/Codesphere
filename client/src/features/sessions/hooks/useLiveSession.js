import { useState } from 'react';

export const useLiveSession = () => {
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  return { participants, setParticipants, isMuted, setIsMuted };
};
