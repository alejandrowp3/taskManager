import React from 'react';
import { Calendar, User, Tag, Clock, GripVertical } from 'lucide-react';
import { Task } from '../types';
import { format } from 'date-fns';

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  dragProps?: React.HTMLAttributes<HTMLDivElement>;
}

const priorityColors = {
  Low: 'bg-green-100 text-green-800 border-l-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 border-l-yellow-400',
  High: 'bg-red-100 text-red-800 border-l-red-400',
};

export function KanbanCard({ 
  task, 
  onEdit, 
  onDelete, 
  isDragging,
  dragProps 
}: KanbanCardProps) {
  const cardClasses = `
    bg-white rounded-lg shadow-sm border border-gray-200 border-l-4 p-4 mb-3
    transition-all duration-200 cursor-move hover:shadow-md
    ${isDragging ? 'opacity-50 scale-95 transform rotate-2 shadow-xl' : ''}
    ${priorityColors[task.priority]}
  `.trim();

  return (
    <div 
      className={cardClasses}
      {...dragProps}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2 flex-1">
          <div className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
            <GripVertical size={14} />
          </div>
          <h3 className="font-medium text-gray-900 text-sm leading-tight flex-1">
            {task.title}
          </h3>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags && task.tags.slice(0, 2).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
          >
            <Tag size={10} />
            {tag}
          </span>
        ))}
        {task.tags && task.tags.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
            +{task.tags.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span className="truncate max-w-[80px]">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{format(task.dueDate, 'MM/dd')}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-xs"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
        <Clock size={10} />
        <span className="text-xs text-gray-400">
          {format(task.updatedAt, 'MM/dd HH:mm')}
        </span>
      </div>
    </div>
  );
}