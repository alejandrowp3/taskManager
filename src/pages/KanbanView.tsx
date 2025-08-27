import { useState, useCallback } from 'react';
import { Plus, Search, LayoutGrid } from 'lucide-react';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskForm } from '../components/TaskForm';
import { ValidationMessage } from '../components/ValidationMessage';
import { ConfirmModal } from '../components/ConfirmModal';
import { useTasks } from '../hooks/useTasks';
import { Task, TaskStatus, TaskOperationResult } from '../types';

export function KanbanView() {
  const { tasks, addTask, updateTask, deleteTask, filter, setFilter } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('To Do');
  const [searchTerm, setSearchTerm] = useState('');
  const [operationResult, setOperationResult] = useState<TaskOperationResult | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; taskId?: string; isLoading: boolean }>({
    isOpen: false,
    taskId: undefined,
    isLoading: false
  });

  // Filter tasks based on current filters and search
  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.assignee && (!task.assignee || !task.assignee.toLowerCase().includes(filter.assignee.toLowerCase()))) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag => 
        task.tags?.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }
    return true;
  });

  const handleMoveTask = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      const result = await updateTask(taskId, { status: newStatus });
      if (!result.success) {
        setOperationResult(result);
      }
    } catch (error) {
      console.error('Error moving task:', error);
      setOperationResult({
        success: false,
        message: 'Failed to move task'
      });
    }
  }, [updateTask]);

  const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await addTask(taskData);
      setOperationResult(result);
      
      if (result.success) {
        setIsFormOpen(false);
        setNewTaskStatus('To Do');
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

  const handleAddTaskClick = useCallback((status: TaskStatus) => {
    setNewTaskStatus(status);
    setIsFormOpen(true);
  }, []);

  const handleEditTaskClick = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <LayoutGrid className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {filteredTasks.length} tasks
          </span>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          aria-label="Create new task"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Operation Result Messages */}
      {operationResult && (
        <ValidationMessage
          message={operationResult.message}
          errors={operationResult.errors}
          type={operationResult.success ? 'success' : 'error'}
          className="mb-4"
        />
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Priority Filter */}
          <div className="sm:w-48">
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value as any || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="sm:w-48">
            <input
              type="text"
              value={filter.assignee || ''}
              onChange={(e) => setFilter({ ...filter, assignee: e.target.value || undefined })}
              placeholder="Filter by assignee..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear Filters */}
          {(filter.priority || filter.assignee || searchTerm) && (
            <button
              onClick={() => {
                setFilter({});
                setSearchTerm('');
              }}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-[calc(100vh-300px)] min-h-[600px]">
        <KanbanBoard
          tasks={filteredTasks}
          onMoveTask={handleMoveTask}
          onEditTask={handleEditTaskClick}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTaskClick}
        />
      </div>

      {/* Task Form Modal */}
      {(isFormOpen || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
            setNewTaskStatus('To Do');
            setOperationResult(null); // Clear any existing error messages
          }}
          defaultStatus={editingTask?.status || newTaskStatus}
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