import React, { useMemo } from 'react';
import { Plus, Circle, Clock, CheckCircle2 } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { KanbanCard } from './KanbanCard';
import { useKanbanDragAndDrop } from '../hooks/useKanbanDragAndDrop';

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

const columnConfig: Array<{
  status: TaskStatus;
  title: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = [
  {
    status: 'To Do',
    title: 'To Do',
    icon: Circle,
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200',
  },
  {
    status: 'In Progress',
    title: 'In Progress',
    icon: Clock,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  {
    status: 'Done',
    title: 'Done',
    icon: CheckCircle2,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
];

export function KanbanBoard({
  tasks,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: KanbanBoardProps) {
  const {
    getTaskDragProps,
    getColumnDropProps,
    isDraggingTask,
    isDropTarget,
  } = useKanbanDragAndDrop(onMoveTask);

  const tasksByStatus = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const getTaskCount = (status: TaskStatus) => tasksByStatus[status]?.length || 0;

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-6">
      {columnConfig.map(({ status, title, icon: Icon, bgColor, textColor, borderColor }) => {
        const columnTasks = tasksByStatus[status] || [];
        const isTarget = isDropTarget(status);
        
        const columnClasses = `
          flex-1 min-w-[320px] max-w-[400px] rounded-lg border-2 transition-all duration-200
          ${isTarget 
            ? 'border-blue-400 bg-blue-50 shadow-lg scale-105' 
            : `${borderColor} ${bgColor}`
          }
        `.trim();

        return (
          <div
            key={status}
            className={columnClasses}
            {...getColumnDropProps(status)}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center gap-2 ${textColor}`}>
                  <Icon size={18} />
                  <h2 className="font-semibold">{title}</h2>
                  <span className="ml-auto bg-white px-2 py-1 rounded-full text-sm font-medium">
                    {getTaskCount(status)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onAddTask(status)}
                className={`
                  w-full flex items-center justify-center gap-2 px-3 py-2 
                  border-2 border-dashed border-gray-300 rounded-md
                  text-gray-500 hover:text-gray-700 hover:border-gray-400
                  transition-colors duration-200
                `}
              >
                <Plus size={16} />
                <span className="text-sm">Add task</span>
              </button>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-4 min-h-[400px] max-h-[70vh] overflow-y-auto">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Icon size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">No tasks</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {columnTasks.map(task => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      isDragging={isDraggingTask(task.id)}
                      dragProps={getTaskDragProps(task)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Drop Zone Indicator */}
            {isTarget && (
              <div className="absolute inset-0 border-4 border-blue-400 border-dashed rounded-lg bg-blue-100 bg-opacity-50 flex items-center justify-center pointer-events-none">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                  Drop here to move to {title}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}