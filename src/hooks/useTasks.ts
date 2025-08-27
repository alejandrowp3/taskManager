import { useMemo } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { Task, TaskFilter } from '../types';

export function useTasks() {
  const { tasks, filter, addTask, updateTask, deleteTask, setFilter } = useTaskContext();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filter.status && task.status !== filter.status) return false;
      if (filter.priority && task.priority !== filter.priority) return false;
      if (filter.assignee && task.assignee !== filter.assignee) return false;
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some(tag => 
          task.tags?.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }
      return true;
    });
  }, [tasks, filter]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const todo = tasks.filter(t => t.status === 'To Do').length;
    
    return {
      total,
      completed,
      inProgress,
      todo,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  const priorityStats = useMemo(() => {
    return {
      high: tasks.filter(t => t.priority === 'High').length,
      medium: tasks.filter(t => t.priority === 'Medium').length,
      low: tasks.filter(t => t.priority === 'Low').length,
    };
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter(task => task.dueDate && task.dueDate >= now && task.dueDate <= nextWeek)
      .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0));
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    addTask,
    updateTask,
    deleteTask,
    setFilter,
    taskStats,
    priorityStats,
    upcomingTasks,
  };
}