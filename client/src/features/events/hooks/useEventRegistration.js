import { useState } from 'react';

export const useEventRegistration = () => {
  const [registered, setRegistered] = useState(false);
  return { registered, setRegistered };
};
