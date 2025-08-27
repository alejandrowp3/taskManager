import { useState, useRef } from 'react';

export interface DragItem {
  id: string;
  index: number;
}

export function useDragAndDrop<T extends { id: string }>(
  _items: T[],
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, item: T, index: number) => {
    const dragData: DragItem = { id: item.id, index };
    setDraggedItem(dragData);
    
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback to the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    
    setDraggedItem(null);
    setDropTarget(null);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedItem && draggedItem.index !== index) {
      setDropTarget(index);
    }
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragCounter.current++;
    
    if (draggedItem && draggedItem.index !== index) {
      setDropTarget(index);
    }
  };

  const handleDragLeave = (_e: React.DragEvent) => {
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    try {
      const dragData = JSON.parse(e.dataTransfer.getData('text/plain')) as DragItem;
      
      if (dragData.index !== dropIndex) {
        onReorder(dragData.index, dropIndex);
      }
    } catch (error) {
      console.error('Error parsing drag data:', error);
    }
    
    setDraggedItem(null);
    setDropTarget(null);
    dragCounter.current = 0;
  };

  const getDragProps = (item: T, index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, item, index),
    onDragEnd: handleDragEnd,
  });

  const getDropProps = (index: number) => ({
    onDragOver: (e: React.DragEvent) => handleDragOver(e, index),
    onDragEnter: (e: React.DragEvent) => handleDragEnter(e, index),
    onDragLeave: handleDragLeave,
    onDrop: (e: React.DragEvent) => handleDrop(e, index),
  });

  const isDragging = (index: number) => draggedItem?.index === index;
  const isDropTarget = (index: number) => dropTarget === index;

  return {
    draggedItem,
    dropTarget,
    getDragProps,
    getDropProps,
    isDragging,
    isDropTarget,
  };
}