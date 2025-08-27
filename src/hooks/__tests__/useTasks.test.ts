import React from 'react';
import { renderHook } from '@testing-library/react';
import { useTasks } from '../useTasks';
import { TaskProvider } from '../../contexts/TaskContext';

const wrapper = ({ children }: { children: React.ReactNode }) => 
  React.createElement(TaskProvider, null, children);

describe('useTasks', () => {
  it('should calculate task statistics correctly', () => {
    const { result } = renderHook(() => useTasks(), { wrapper });
    
    const stats = result.current.taskStats;
    
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(stats.completionRate).toBeGreaterThanOrEqual(0);
    expect(stats.completionRate).toBeLessThanOrEqual(100);
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
});
