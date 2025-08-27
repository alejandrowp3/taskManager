import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Task, TaskContextType, TaskFilter, TaskStatus, Priority } from '../types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: TaskFilter }
  | { type: 'REORDER_TASKS'; payload: { fromIndex: number; toIndex: number } };

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return { ...state, tasks: [...state.tasks, newTask] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'REORDER_TASKS':
      const { fromIndex, toIndex } = action.payload;
      const newTasks = [...state.tasks];
      const [movedTask] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, movedTask);
      return { ...state, tasks: newTasks };

    default:
      return state;
  }
}

// Load tasks in saved order from localStorage
function loadTasksWithOrder(): Task[] {
  const defaultTasks: Task[] = [
    {
      id: '1',
      title: 'Design User Interface',
      description: 'Create mockups and wireframes for the application',
      status: 'In Progress' as TaskStatus,
      priority: 'High' as Priority,
      dueDate: new Date('2024-02-15'),
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      tags: ['design', 'ui'],
      assignee: 'Ana Garcia',
    },
    {
      id: '2',
      title: 'Implement Authentication',
      description: 'Login and user registration system',
      status: 'To Do' as TaskStatus,
      priority: 'Medium' as Priority,
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
      tags: ['backend', 'security'],
      assignee: 'Carlos Lopez',
    },
    {
      id: '3',
      title: 'Unit Testing',
      description: 'Write tests for main components',
      status: 'Done' as TaskStatus,
      priority: 'Low' as Priority,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      tags: ['testing'],
    },
  ];

  try {
    const savedOrder = localStorage.getItem('task-order');
    if (savedOrder) {
      const taskIds = JSON.parse(savedOrder);
      const taskMap = new Map(defaultTasks.map(task => [task.id, task]));
      const orderedTasks = taskIds.map((id: string) => taskMap.get(id)).filter(Boolean);
      
      // Add any new tasks that weren't in the saved order
      const existingIds = new Set(taskIds);
      const newTasks = defaultTasks.filter(task => !existingIds.has(task.id));
      
      return [...orderedTasks, ...newTasks];
    }
  } catch (error) {
    console.warn('Failed to load task order:', error);
  }

  return defaultTasks;
}

const initialState: TaskState = {
  tasks: loadTasksWithOrder(),
  filter: {},
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const setFilter = (filter: TaskFilter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const reorderTasks = (fromIndex: number, toIndex: number) => {
    dispatch({ type: 'REORDER_TASKS', payload: { fromIndex, toIndex } });
    
    // Persist the new order to localStorage
    setTimeout(() => {
      try {
        const updatedTasks = [...state.tasks];
        const [movedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(toIndex, 0, movedTask);
        localStorage.setItem('task-order', JSON.stringify(updatedTasks.map(task => task.id)));
      } catch (error) {
        console.warn('Failed to persist task order:', error);
      }
    }, 0);
  };

  return (
    <TaskContext.Provider value={{
      tasks: state.tasks,
      addTask,
      updateTask,
      deleteTask,
      filter: state.filter,
      setFilter,
      reorderTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within TaskProvider');
  }
  return context;
}