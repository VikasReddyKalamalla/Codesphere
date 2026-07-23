import { useState } from 'react';

export const useLesson = (initialLesson = null) => {
  const [activeLesson, setActiveLesson] = useState(initialLesson);
  return { activeLesson, setActiveLesson };
};
