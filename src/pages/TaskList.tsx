import { useState, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { TaskFilter } from '../components/TaskFilter';
import { ValidationMessage } from '../components/ValidationMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskOperationResult } from '../types';

export function TaskList() {
  const { tasks, addTask, updateTask, deleteTask, filter, setFilter } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [operationResult, setOperationResult] = useState<TaskOperationResult | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId?: string; isLoading: boolean }>({
    isOpen: false,
    taskId: undefined,
    isLoading: false
  });

  const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await addTask(taskData);
      setOperationResult(result);
      
      if (result.success) {
        setIsFormOpen(false);
        // Clear success message after 3 seconds
        setTimeout(() => setOperationResult(null), 3000);
      }
    } catch (error) {
      console.error('Error adding task:', error);
      setOperationResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }, [addTask]);

  const handleEditTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    try {
      const result = await updateTask(editingTask.id, taskData);
      setOperationResult(result);
      
      if (result.success) {
        setEditingTask(undefined);
        // Clear success message after 3 seconds
        setTimeout(() => setOperationResult(null), 3000);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setOperationResult({
        success: false,
        message: 'An unexpected error occurred'
      });
    }
  }, [editingTask, updateTask]);

  const handleStatusChange = useCallback(async (id: string, status: Task['status']) => {
    try {
      const result = await updateTask(id, { status });
      if (!result.success) {
        setOperationResult(result);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setOperationResult({
        success: false,
        message: 'Failed to update task status'
      });
    }
  }, [updateTask]);

  const handleEditClick = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, taskId: id, isLoading: false });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirm.taskId) return;
    
    setDeleteConfirm(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await deleteTask(deleteConfirm.taskId);
      setOperationResult(result);
      
      if (result.success) {
        // Clear success message after 3 seconds
        setTimeout(() => setOperationResult(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setOperationResult({
        success: false,
        message: 'An unexpected error occurred while deleting the task'
      });
    } finally {
      setDeleteConfirm({ isOpen: false, taskId: undefined, isLoading: false });
    }
  }, [deleteTask, deleteConfirm.taskId]);

  const handleCancelDelete = useCallback(() => {
    if (!deleteConfirm.isLoading) {
      setDeleteConfirm({ isOpen: false, taskId: undefined, isLoading: false });
    }
  }, [deleteConfirm.isLoading]);

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dueDate':
          const aDate = a.dueDate?.getTime() || 0;
          const bDate = b.dueDate?.getTime() || 0;
          comparison = aDate - bDate;
          break;
        case 'priority':
          const priorityOrder = { Low: 1, Medium: 2, High: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [tasks, sortBy, sortOrder]);

  // Drag and drop functionality


  const toggleSort = useCallback((newSortBy: 'dueDate' | 'priority' | 'createdAt') => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          aria-label="Create new task"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      <TaskFilter filter={filter} onFilterChange={setFilter} />

      {/* Operation Result Messages */}
      {operationResult && (
        <ValidationMessage
          message={operationResult.message}
          errors={operationResult.errors}
          type={operationResult.success ? 'success' : 'error'}
          className="mb-4"
        />
      )}

      <div className="flex gap-4 items-center">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort('createdAt')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortBy === 'createdAt'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Creation Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('dueDate')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortBy === 'dueDate'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('priority')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortBy === 'priority'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
        <span className="text-sm text-gray-500">({sortedTasks.length} tasks)</span>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 mt-2">Try adjusting the filters or creating a new task</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {(isFormOpen || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
            setOperationResult(null); // Clear any existing error messages
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={deleteConfirm.isLoading}
      />
    </div>
  );
}