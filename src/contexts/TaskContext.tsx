import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Task, TaskContextType, TaskFilter, ValidationError, TaskOperationResult } from '../types';
import { taskFormSchema, updateTaskFormSchema, getTaskValidationErrors } from '../schemas/taskSchema';
import { useTaskData } from './TaskDataProvider';
import { invalidateSuspenseCache } from '../hooks/useSuspenseData';

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



export function TaskProvider({ children }: { children: ReactNode }) {
  const initialTasks = useTaskData(); // Get pre-loaded tasks from Suspense
  
  const initialState: TaskState = {
    tasks: initialTasks,
    filter: {},
  };
  
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Sync with pre-loaded data when it changes
  useEffect(() => {
    dispatch({ type: 'SET_TASKS', payload: initialTasks });
  }, [initialTasks]);

  // Save tasks to localStorage whenever tasks change
  const saveTasksToStorage = (tasks: Task[]) => {
    try {
      localStorage.setItem('task-management-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  };

  // Validation helper function
  const validateTask = (task: Partial<Task>, isUpdate: boolean = false): ValidationError[] => {
    try {
      // For updates, use relaxed validation schema
      const schema = isUpdate ? updateTaskFormSchema : taskFormSchema;
      
      // Transform Task to TaskFormData format for validation
      // Only include fields that are actually being updated
      const formData: any = {};
      
      if (task.title !== undefined) formData.title = task.title;
      if (task.description !== undefined) formData.description = task.description;
      if (task.status !== undefined) formData.status = task.status;
      if (task.priority !== undefined) formData.priority = task.priority;
      if (task.dueDate !== undefined) formData.dueDate = task.dueDate.toISOString().split('T')[0];
      if (task.assignee !== undefined) formData.assignee = task.assignee;
      if (task.tags !== undefined) formData.tags = Array.isArray(task.tags) ? task.tags.join(', ') : '';

      // For new tasks, ensure all required fields have defaults
      if (!isUpdate) {
        formData.title = task.title || '';
        formData.description = task.description || '';
        formData.status = task.status || 'To Do';
        formData.priority = task.priority || 'Medium';
        formData.dueDate = task.dueDate ? task.dueDate.toISOString().split('T')[0] : '';
        formData.assignee = task.assignee || '';
        formData.tags = Array.isArray(task.tags) ? task.tags.join(', ') : '';
      }

      schema.parse(formData);
      return [];
    } catch (error) {
      // Parse Zod errors directly
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as any;
        return zodError.issues.map((issue: any) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
      }
      
      // Fallback
      const validationErrors = getTaskValidationErrors(task);
      return Object.entries(validationErrors).map(([field, message]) => ({
        field,
        message
      }));
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaskOperationResult> => {
    try {
      // Validate the task data
      const validationErrors = validateTask(task, false); // false = creating new task
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors,
          message: 'Task validation failed'
        };
      }

      // Additional business logic validation
      if (task.title && state.tasks.some(existingTask => 
        existingTask.title.toLowerCase() === task.title.toLowerCase()
      )) {
        return {
          success: false,
          errors: [{ field: 'title', message: 'A task with this title already exists' }],
          message: 'Duplicate task title'
        };
      }

      // If validation passes, dispatch the action
      dispatch({ type: 'ADD_TASK', payload: task });
      
      // Save updated tasks to localStorage
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedTasks = [...state.tasks, newTask];
      saveTasksToStorage(updatedTasks);
      invalidateSuspenseCache(); // Invalidate Suspense cache
      
      return {
        success: true,
        message: 'Task created successfully'
      };
    } catch (error) {
      console.error('Error adding task:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while creating the task'
      };
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<TaskOperationResult> => {
    try {
      // Find the existing task
      const existingTask = state.tasks.find(task => task.id === id);
      if (!existingTask) {
        return {
          success: false,
          message: 'Task not found'
        };
      }

      // Validate the updates
      const validationErrors = validateTask(updates, true); // true = updating existing task
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors,
          message: 'Task update validation failed'
        };
      }

      // Additional business logic validation
      if (updates.title && updates.title !== existingTask.title) {
        const duplicateTask = state.tasks.find(task => 
          task.id !== id && task.title.toLowerCase() === updates.title!.toLowerCase()
        );
        if (duplicateTask) {
          return {
            success: false,
            errors: [{ field: 'title', message: 'A task with this title already exists' }],
            message: 'Duplicate task title'
          };
        }
      }

      // If validation passes, dispatch the action
      dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
      
      // Save updated tasks to localStorage
      const updatedTasks = state.tasks.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      );
      saveTasksToStorage(updatedTasks);
      invalidateSuspenseCache(); // Invalidate Suspense cache
      
      return {
        success: true,
        message: 'Task updated successfully'
      };
    } catch (error) {
      console.error('Error updating task:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while updating the task'
      };
    }
  };

  const deleteTask = async (id: string): Promise<TaskOperationResult> => {
    try {
      const existingTask = state.tasks.find(task => task.id === id);
      if (!existingTask) {
        return {
          success: false,
          message: 'Task not found'
        };
      }

      dispatch({ type: 'DELETE_TASK', payload: id });
      
      // Save updated tasks to localStorage
      const updatedTasks = state.tasks.filter(task => task.id !== id);
      saveTasksToStorage(updatedTasks);
      invalidateSuspenseCache(); // Invalidate Suspense cache
      
      return {
        success: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while deleting the task'
      };
    }
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
        saveTasksToStorage(updatedTasks);
        invalidateSuspenseCache(); // Invalidate Suspense cache
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