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
  {
    id: '4',
    title: 'Database Schema Design',
    description: 'Design and create database tables for user management and task storage',
    status: 'Done' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-01-25'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
    tags: ['database', 'backend'],
    assignee: 'Maria Rodriguez',
  },
  {
    id: '5',
    title: 'API Documentation',
    description: 'Document all REST API endpoints with examples',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-21'),
    tags: ['documentation', 'api'],
    assignee: 'David Kim',
  },
  {
    id: '6',
    title: 'Performance Optimization',
    description: 'Optimize database queries and improve loading times',
    status: 'To Do' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-03-01'),
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    tags: ['performance', 'optimization'],
    assignee: 'Sarah Johnson',
  },
  {
    id: '7',
    title: 'Mobile Responsive Design',
    description: 'Ensure all components work properly on mobile devices',
    status: 'In Progress' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-02-10'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20'),
    tags: ['frontend', 'mobile', 'css'],
    assignee: 'Ana Garcia',
  },
  {
    id: '8',
    title: 'Code Review Process',
    description: 'Establish code review guidelines and implement PR templates',
    status: 'Done' as TaskStatus,
    priority: 'Low' as Priority,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    tags: ['process', 'quality'],
    assignee: 'Carlos Lopez',
  },
  {
    id: '9',
    title: 'Security Audit',
    description: 'Conduct comprehensive security testing and vulnerability assessment',
    status: 'To Do' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-02-28'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    tags: ['security', 'audit'],
    assignee: 'Michael Chen',
  },
  {
    id: '10',
    title: 'User Analytics Integration',
    description: 'Implement Google Analytics and user behavior tracking',
    status: 'To Do' as TaskStatus,
    priority: 'Low' as Priority,
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    tags: ['analytics', 'tracking'],
    assignee: 'Sarah Johnson',
  },
  {
    id: '11',
    title: 'Email Notification System',
    description: 'Build automated email notifications for task updates and deadlines',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-02-25'),
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21'),
    tags: ['backend', 'notifications', 'email'],
    assignee: 'David Kim',
  },
  {
    id: '12',
    title: 'Backup Strategy',
    description: 'Implement automated database backups and disaster recovery plan',
    status: 'Done' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-01-30'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-28'),
    tags: ['infrastructure', 'backup'],
    assignee: 'Maria Rodriguez',
  },
  {
    id: '13',
    title: 'Dark Mode Implementation',
    description: 'Add dark mode theme option with user preference storage',
    status: 'To Do' as TaskStatus,
    priority: 'Low' as Priority,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21'),
    tags: ['frontend', 'ui', 'theme'],
    assignee: 'Ana Garcia',
  },
  {
    id: '14',
    title: 'Integration Testing',
    description: 'Write integration tests for API endpoints and user workflows',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-02-18'),
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-19'),
    tags: ['testing', 'integration'],
    assignee: 'Michael Chen',
  },
  {
    id: '15',
    title: 'Error Handling Improvement',
    description: 'Improve error messages and implement better error boundaries',
    status: 'Done' as TaskStatus,
    priority: 'Medium' as Priority,
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-16'),
    tags: ['frontend', 'error-handling'],
    assignee: 'Sarah Johnson',
  },
  {
    id: '16',
    title: 'Load Testing',
    description: 'Perform load testing to ensure system handles expected traffic',
    status: 'To Do' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-03-05'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    tags: ['testing', 'performance'],
    assignee: 'David Kim',
  },
  {
    id: '17',
    title: 'User Onboarding Flow',
    description: 'Create guided onboarding experience for new users',
    status: 'In Progress' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-02-22'),
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-20'),
    tags: ['frontend', 'ux', 'onboarding'],
    assignee: 'Ana Garcia',
  },
  {
    id: '18',
    title: 'Accessibility Improvements',
    description: 'Ensure WCAG 2.1 compliance and improve keyboard navigation',
    status: 'To Do' as TaskStatus,
    priority: 'Medium' as Priority,
    dueDate: new Date('2024-03-10'),
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    tags: ['frontend', 'accessibility', 'a11y'],
    assignee: 'Michael Chen',
  },
  {
    id: '19',
    title: 'CI/CD Pipeline Setup',
    description: 'Configure automated deployment pipeline with testing and staging environments',
    status: 'Done' as TaskStatus,
    priority: 'High' as Priority,
    dueDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-18'),
    tags: ['devops', 'ci-cd', 'automation'],
    assignee: 'Carlos Lopez',
  },
  {
    id: '20',
    title: 'Customer Feedback System',
    description: 'Implement in-app feedback collection and rating system',
    status: 'To Do' as TaskStatus,
    priority: 'Low' as Priority,
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    tags: ['frontend', 'feedback', 'ui'],
    assignee: 'Sarah Johnson',
  }
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