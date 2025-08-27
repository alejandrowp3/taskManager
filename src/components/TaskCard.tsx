import React from 'react';
import { Calendar, User, Tag, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

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

export function TaskCard({ 
  task, 
  onStatusChange, 
  onEdit, 
  onDelete
}: TaskCardProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Task['status']);
  };

  const cardClasses = `
    bg-white rounded-lg shadow-md p-6 border border-gray-200 
    transition-all duration-200 hover:shadow-lg
  `.trim();

  return (
    <div className={cardClasses}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        </div>
        <div className="flex gap-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statusColors[task.status]}`}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{task.assignee}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{format(task.dueDate, 'dd/MM/yyyy')}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{format(task.updatedAt, 'dd/MM/yyyy')}</span>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Tag size={14} className="text-gray-400" />
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Link
          to={`/tasks/${task.id}`}
          className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded inline-flex items-center gap-1"
        >
          <Eye size={14} />
          View
        </Link>
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}