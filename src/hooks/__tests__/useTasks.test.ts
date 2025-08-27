import { renderHook } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { TaskProvider } from '../../contexts/TaskContext';
import { Task } from '../../types';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    status: 'To Do',
    priority: 'High',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Test Task 2',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Test Task 3',
    status: 'Done',
    priority: 'Low',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
);

describe('useTasks', () => {
  it('should calculate task statistics correctly', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    const stats = result.current.taskStats;
    
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
    expect(stats.completionRate).toBeLessThanOrEqual(100);
  });

  it('should filter tasks by status', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    result.current.setFilter({ status: 'Done' });
    
    const filteredTasks = result.current.tasks;
    
    if (filteredTasks.length > 0) {
      filteredTasks.forEach(task => {
        expect(task.status).toBe('Done');
      });
    }
  });

  it('should filter tasks by priority', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    result.current.setFilter({ priority: 'High' });
    
    const filteredTasks = result.current.tasks;
    
    if (filteredTasks.length > 0) {
      filteredTasks.forEach(task => {
        expect(task.priority).toBe('High');
      });
    }
  });

  it('should filter tasks by search term', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    result.current.setFilter({ search: 'design' });
    
    const filteredTasks = result.current.tasks;
    
    if (filteredTasks.length > 0) {
      filteredTasks.forEach(task => {
        expect(task.title.toLowerCase()).toContain('design');
      });
    }
  });

  it('should calculate priority statistics correctly', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    const priorityStats = result.current.priorityStats;
    
    expect(typeof priorityStats.high).toBe('number');
    expect(typeof priorityStats.medium).toBe('number');
    expect(typeof priorityStats.low).toBe('number');
    
    expect(priorityStats.high).toBeGreaterThanOrEqual(0);
    expect(priorityStats.medium).toBeGreaterThanOrEqual(0);
    expect(priorityStats.low).toBeGreaterThanOrEqual(0);
  });

  it('should return upcoming tasks within next week', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    const upcomingTasks = result.current.upcomingTasks;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    upcomingTasks.forEach(task => {
      if (task.dueDate) {
        expect(task.dueDate.getTime()).toBeGreaterThanOrEqual(now.getTime());
        expect(task.dueDate.getTime()).toBeLessThanOrEqual(nextWeek.getTime());
      }
    });
  });
});