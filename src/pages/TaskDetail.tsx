import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User, Tag, Clock, AlertCircle } from 'lucide-react';
import { TaskForm } from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allTasks, updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);

  const task = allTasks.find(t => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h2>
        <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
      </div>
    );
  }

  const handleEdit = (taskData: any) => {
    updateTask(task.id, taskData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    'To Do': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Done': 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority]}`}>
                Priority: {task.priority}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
                {task.status === 'Done' ? 'Done' :
                 task.status === 'In Progress' ? 'In Progress' : 'To Do'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            {task.description ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">No description</p>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
            <div className="space-y-4">
              {task.assignee && (
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Assigned to</p>
                    <p className="font-medium text-gray-900">{task.assignee}</p>
                  </div>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <div>
                    <p className="text-sm text-gray-600">Due date</p>
                    <p className="font-medium text-gray-900">
                      {format(task.dueDate, 'MM/dd/yyyy')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {format(task.createdAt, 'MM/dd/yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="font-medium text-gray-900">
                    {format(task.updatedAt, 'MM/dd/yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Status</h2>
            <select
              value={task.status}
              onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>
      </div>

      {isEditing && (
        <TaskForm
          task={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}