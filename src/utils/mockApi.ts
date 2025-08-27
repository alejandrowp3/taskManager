import { Task, TaskStatus, Priority } from '../types';

const STORAGE_KEY = 'task-management-tasks';

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

class MockTaskAPI {
  private async delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private loadTasks(): Task[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      }
    } catch (error) {
      console.warn('Failed to load tasks from localStorage:', error);
    }
    return defaultTasks;
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('Failed to save tasks to localStorage:', error);
    }
  }

  async getTasks(): Promise<Task[]> {
    await this.delay();
    return this.loadTasks();
  }

  async getTask(id: string): Promise<Task | undefined> {
    await this.delay(400);
    const tasks = this.loadTasks();
    return tasks.find(task => task.id === id);
  }

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    await this.delay(600);
    const tasks = this.loadTasks();
    
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    tasks.push(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    await this.delay(400);
    const tasks = this.loadTasks();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await this.delay(300);
    const tasks = this.loadTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.saveTasks(filteredTasks);
  }
}

export const mockApi = new MockTaskAPI();

let taskCache: Promise<Task[]> | null = null;

export function fetchTasks(): Promise<Task[]> {
  if (!taskCache) {
    taskCache = mockApi.getTasks();
  }
  return taskCache;
}

export function invalidateTaskCache(): void {
  taskCache = null;
}