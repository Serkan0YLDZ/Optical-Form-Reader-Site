import { useState, useEffect } from 'react';
import { Selection } from '@/types';

export function useSelection(mode: string, onSelectionChange?: (selection: Selection | null) => void) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (mode === 'slider') {
      setSelection(null);
      setIsSelecting(false);
      onSelectionChange?.(null);
    }
  }, [mode, onSelectionChange]);

  useEffect(() => {
    onSelectionChange?.(selection);
  }, [selection, onSelectionChange]);

  return {
    selection,
    setSelection,
    isSelecting,
    setIsSelecting,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    dragOffset,
    setDragOffset
  };
} 