import React from 'react';
import { Task } from '../types';

interface DragPreviewProps {
  task: Task;
}

export function DragPreview({ task }: DragPreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl border-2 border-blue-400 p-4 opacity-90 transform rotate-3 scale-105">
      <h3 className="font-semibold text-gray-900 text-sm">{task.title}</h3>
      <div className="flex items-center gap-2 mt-2">
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
          {task.status}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
          {task.priority}
        </span>
      </div>
    </div>
  );
}