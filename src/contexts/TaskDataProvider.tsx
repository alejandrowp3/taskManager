import { createContext, useContext, ReactNode } from 'react';
import { Task } from '../types';
import { useSuspenseData } from '../hooks/useSuspenseData';

const TaskDataContext = createContext<Task[] | undefined>(undefined);

export function useTaskData(): Task[] {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error('useTaskData must be used within a TaskDataProvider');
  }
  return context;
}

interface TaskDataProviderProps {
  children: ReactNode;
}

export function TaskDataProvider({ children }: TaskDataProviderProps) {
  // This will suspend if data is not ready
  const tasks = useSuspenseData();
  
  return (
    <TaskDataContext.Provider value={tasks}>
      {children}
    </TaskDataContext.Provider>
  );
}
