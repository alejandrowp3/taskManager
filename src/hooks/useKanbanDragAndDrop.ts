import { useState, useRef } from 'react';
import { Task, TaskStatus } from '../types';

export interface KanbanDragItem {
  id: string;
  task: Task;
  fromStatus: TaskStatus;
}

export function useKanbanDragAndDrop(
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void
) {
  const [draggedItem, setDraggedItem] = useState<KanbanDragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const dragCounter = useRef<Record<TaskStatus, number>>({
    'To Do': 0,
    'In Progress': 0,
    'Done': 0,
  });

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    const dragData: KanbanDragItem = {
      id: task.id,
      task,
      fromStatus: task.status,
    };
    
    setDraggedItem(dragData);
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
      e.currentTarget.style.transform = 'rotate(5deg) scale(0.95)';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'none';
    }
    
    setDraggedItem(null);
    setDropTarget(null);
    dragCounter.current = {
      'To Do': 0,
      'In Progress': 0,
      'Done': 0,
    };
  };

  const handleDragOver = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem && draggedItem.fromStatus !== targetStatus) {
      setDropTarget(targetStatus);
    }
  };

  const handleDragEnter = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    dragCounter.current[targetStatus]++;
    
    if (draggedItem && draggedItem.fromStatus !== targetStatus) {
      setDropTarget(targetStatus);
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetStatus: TaskStatus) => {
    dragCounter.current[targetStatus]--;
    
    if (dragCounter.current[targetStatus] === 0) {
      if (dropTarget === targetStatus) {
        setDropTarget(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(
        e.dataTransfer.getData('application/json')
      ) as KanbanDragItem;
      
      if (dragData.fromStatus !== targetStatus) {
        onMoveTask(dragData.id, targetStatus);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
    
    setDraggedItem(null);
    setDropTarget(null);
    dragCounter.current = {
      'To Do': 0,
      'In Progress': 0,
      'Done': 0,
    };
  };

  const getTaskDragProps = (task: Task) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, task),
    onDragEnd: handleDragEnd,
  });

  const getColumnDropProps = (status: TaskStatus) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(e, status),
    onDragEnter: (e: React.DragEvent) => handleDragEnter(e, status),
    onDragLeave: (e: React.DragEvent) => handleDragLeave(e, status),
    onDrop: (e: React.DragEvent) => handleDrop(e, status),
  });

  const isDraggingTask = (taskId: string) => draggedItem?.id === taskId;
  const isDropTarget = (status: TaskStatus) => dropTarget === status;

  return {
    draggedItem,
    getTaskDragProps,
    getColumnDropProps,
    isDraggingTask,
    isDropTarget,
  };
}