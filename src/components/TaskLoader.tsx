import React, { useEffect } from 'react';
import { useTaskContext } from '../contexts/TaskContext';

export function TaskLoader({ children }: { children: React.ReactNode }) {
  const { loadTasks, tasks } = useTaskContext();

  useEffect(() => {
    if (tasks.length === 0) {
      loadTasks();
    }
  }, [loadTasks, tasks.length]);

  return <>{children}</>;
}