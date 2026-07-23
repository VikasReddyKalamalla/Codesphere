import { useState } from 'react';

export const useTasks = (initialTasks = []) => {
  const [tasks, setTasks] = useState(initialTasks);
  const addTask = (title) => {
    setTasks([...tasks, { id: Date.now().toString(), title, status: 'todo' }]);
  };
  return { tasks, addTask, setTasks };
};
