import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task, TaskStatus } from '../types';
import { taskFormSchema, updateTaskFormSchema, type TaskFormData, type UpdateTaskFormData } from '../schemas/taskSchema';

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  defaultStatus?: TaskStatus;
}

export function TaskForm({ task, onSubmit, onCancel, defaultStatus }: TaskFormProps) {
  // Use different schema for create vs update
  const schema = task ? updateTaskFormSchema : taskFormSchema;
  type FormData = typeof task extends undefined ? TaskFormData : UpdateTaskFormData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    mode: 'onChange', // Validate on every change for real-time feedback
    defaultValues: {
    title: task?.title || '',
    description: task?.description || '',
      status: task?.status || defaultStatus || 'To Do',
      priority: task?.priority || 'Medium',
    dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
    assignee: task?.assignee || '',
    tags: task?.tags ? task.tags.join(', ') : '',
    }
  });

  // Ensure form values are updated when task prop changes
  React.useEffect(() => {
    const formValues = {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || defaultStatus || 'To Do',
      priority: task?.priority || 'Medium',
      dueDate: task?.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      assignee: task?.assignee || '',
      tags: task?.tags ? task.tags.join(', ') : '',
    };
    
    reset(formValues);
  }, [task, defaultStatus, reset]);

  // Watch for form changes to provide better UX
  const watchedFields = watch();

  // Manual change detection for edge cases
  const hasManualChanges = React.useMemo(() => {
    if (!task) return false; // For new tasks, always allow submission if valid
    
    const current = watchedFields;
    const original = {
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      assignee: task.assignee || '',
      tags: task.tags ? task.tags.join(', ') : '',
    };

    const hasChanges = (
      current.title !== original.title ||
      current.description !== original.description ||
      current.status !== original.status ||
      current.priority !== original.priority ||
      current.dueDate !== original.dueDate ||
      current.assignee !== original.assignee ||
      current.tags !== original.tags
    );

    return hasChanges;
  }, [task, watchedFields]);



  const onFormSubmit = (data: FormData) => {
    try {
      // Transform form data to Task format, ensuring required fields have values
      const taskData = {
        title: data.title || '',
        description: data.description || undefined,
        status: data.status || 'To Do',
        priority: data.priority || 'Medium',
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignee: data.assignee || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      };

      onSubmit(taskData);
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    reset(); // Reset form on cancel
    onCancel();
  };

  // Helper function to get error message for a field
  const getErrorMessage = (fieldName: keyof FormData): string | undefined => {
    const error = errors[fieldName];
    return error?.message;
  };

  // Helper function to determine if field has error
  const hasError = (fieldName: keyof FormData): boolean => {
    return Boolean(errors[fieldName]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
            {/* Title Field - Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  hasError('title') 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter task title..."
                aria-invalid={hasError('title')}
                aria-describedby={hasError('title') ? 'title-error' : undefined}
              />
              {hasError('title') && (
                <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                  {getErrorMessage('title')}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors resize-none ${
                  hasError('description') 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Describe the task (optional)..."
                aria-invalid={hasError('description')}
                aria-describedby={hasError('description') ? 'description-error' : undefined}
              />
              {hasError('description') && (
                <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                  {getErrorMessage('description')}
                </p>
              )}
            </div>

            {/* Status and Priority Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-white cursor-pointer ${
                        hasError('status') 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                      }`}
                      aria-invalid={hasError('status')}
                      disabled={isSubmitting}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                </select>
                  )}
                />
                {hasError('status') && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {getErrorMessage('status')}
                  </p>
                )}
              </div>

              {/* Priority Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-white cursor-pointer ${
                        hasError('priority') 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                      }`}
                      aria-invalid={hasError('priority')}
                      disabled={isSubmitting}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                </select>
                  )}
                />
                {hasError('priority') && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {getErrorMessage('priority')}
                  </p>
                )}
              </div>
            </div>

            {/* Due Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                {...register('dueDate')}
                type="date"
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  hasError('dueDate') 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                aria-invalid={hasError('dueDate')}
                aria-describedby={hasError('dueDate') ? 'dueDate-error' : undefined}
              />
              {hasError('dueDate') && (
                <p id="dueDate-error" className="mt-1 text-sm text-red-600" role="alert">
                  {getErrorMessage('dueDate')}
                </p>
              )}
            </div>

            {/* Assignee Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <input
                {...register('assignee')}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  hasError('assignee') 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Enter assignee name..."
                aria-invalid={hasError('assignee')}
                aria-describedby={hasError('assignee') ? 'assignee-error' : undefined}
              />
              {hasError('assignee') && (
                <p id="assignee-error" className="mt-1 text-sm text-red-600" role="alert">
                  {getErrorMessage('assignee')}
                </p>
              )}
            </div>

            {/* Tags Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                {...register('tags')}
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  hasError('tags') 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="frontend, urgent, bug"
                aria-invalid={hasError('tags')}
                aria-describedby={hasError('tags') ? 'tags-error' : undefined}
              />
              {hasError('tags') && (
                <p id="tags-error" className="mt-1 text-sm text-red-600" role="alert">
                  {getErrorMessage('tags')}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum 10 tags, each up to 20 characters
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isValid || (task && !isDirty && !hasManualChanges)}
                className={`flex-1 py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  isSubmitting || !isValid || (task && !isDirty && !hasManualChanges)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {task ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  task ? 'Update Task' : 'Create Task'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`flex-1 py-2 px-4 rounded-md font-medium border transition-all ${
                  isSubmitting
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
                }`}
              >
                Cancel
              </button>
            </div>

            {/* Form Status Feedback */}
            {task && !isDirty && !hasManualChanges && isValid && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Make changes to enable the update button
                </p>
              </div>
            )}



            {/* Form Status Info */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600 font-medium">
                  Please fix the following errors:
                </p>
                <ul className="mt-1 text-sm text-red-600 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error?.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}