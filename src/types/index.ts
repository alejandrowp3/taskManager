export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  assignee?: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type Priority = 'Low' | 'Medium' | 'High';

export interface TaskFilter {
  status?: TaskStatus;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  search?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface TaskOperationResult {
  success: boolean;
  errors?: ValidationError[];
  message?: string;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TaskOperationResult>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<TaskOperationResult>;
  deleteTask: (id: string) => Promise<TaskOperationResult>;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  reorderTasks: (fromIndex: number, toIndex: number) => void;
}