import { Selection } from '@/types';

export function createSelectionHandlers(
  mode: string,
  selection: Selection | null,
  setSelection: (selection: Selection | null) => void,
  isSelecting: boolean,
  setIsSelecting: (isSelecting: boolean) => void,
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  isResizing: string | null,
  setIsResizing: (isResizing: string | null) => void,
  dragOffset: { x: number; y: number },
  setDragOffset: (offset: { x: number; y: number }) => void
) {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode !== 'selector') return;

    const x = e.clientX;
    const y = e.clientY;
    const mousePageX = e.pageX;
    const mousePageY = e.pageY;

    if (selection) {
      const selectionRect = {
        left: Math.min(selection.startX, selection.endX),
        right: Math.max(selection.startX, selection.endX),
        top: Math.min(selection.startY, selection.endY),
        bottom: Math.max(selection.startY, selection.endY),
      };

      const corners = [
        { pos: 'nw', x: selectionRect.left, y: selectionRect.top },
        { pos: 'ne', x: selectionRect.right, y: selectionRect.top },
        { pos: 'sw', x: selectionRect.left, y: selectionRect.bottom },
        { pos: 'se', x: selectionRect.right, y: selectionRect.bottom }
      ];

      for (const corner of corners) {
        if (Math.abs(x - corner.x) < 10 && Math.abs(y - corner.y) < 10) {
          setIsResizing(corner.pos);
          return;
        }
      }

      if (x >= selectionRect.left && x <= selectionRect.right &&
          y >= selectionRect.top && y <= selectionRect.bottom) {
        setIsDragging(true);
        setDragOffset({
          x: x - selectionRect.left,
          y: y - selectionRect.top
        });
        return;
      }
    }

    const newSelection: Selection = {
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      width: 0,
      height: 0,
      displayX: mousePageX,
      displayY: mousePageY,
      displayWidth: 0,
      displayHeight: 0,
      cropX: 0,
      cropY: 0,
      cropWidth: 0,
      cropHeight: 0
    };

    setSelection(newSelection);
    setIsSelecting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode !== 'selector') return;

    const x = e.clientX;
    const y = e.clientY;
    const mousePageX = e.pageX;
    const mousePageY = e.pageY;

    if (isSelecting && selection) {
      requestAnimationFrame(() => {
        const width = x - selection.startX;
        const height = y - selection.startY;
        
        const displayWidth = mousePageX - selection.displayX;
        const displayHeight = mousePageY - selection.displayY;

        setSelection({
          ...selection,
          endX: x,
          endY: y,
          width: Math.abs(width),
          height: Math.abs(height),
          displayWidth: displayWidth,
          displayHeight: displayHeight,
          cropWidth: Math.abs(displayWidth),
          cropHeight: Math.abs(displayHeight)
        });
      });
    } else if (isDragging && selection) {
      requestAnimationFrame(() => {
        const width = Math.abs(selection.endX - selection.startX);
        const height = Math.abs(selection.endY - selection.startY);
        const newStartX = x - dragOffset.x;
        const newStartY = y - dragOffset.y;

        setSelection({
          ...selection,
          startX: newStartX,
          startY: newStartY,
          endX: newStartX + width,
          endY: newStartY + height,
          width,
          height,
          displayX: e.pageX - dragOffset.x,
          displayY: e.pageY - dragOffset.y,
          displayWidth: width,
          displayHeight: height,
          cropX: newStartX + 75,
          cropY: newStartY,
          cropWidth: width,
          cropHeight: height
        });
      });
    } else if (isResizing && selection) {
      requestAnimationFrame(() => {
        const originalLeft = Math.min(selection.startX, selection.endX);
        const originalTop = Math.min(selection.startY, selection.endY);
        const originalRight = Math.max(selection.startX, selection.endX);
        const originalBottom = Math.max(selection.startY, selection.endY);

        let newSelection = { ...selection };

        switch (isResizing) {
          case 'nw':
            newSelection = {
              ...selection,
              startX: x,
              startY: y,
              endX: originalRight,
              endY: originalBottom,
            };
            break;
          case 'ne':
            newSelection = {
              ...selection,
              startX: originalLeft,
              startY: y,
              endX: x,
              endY: originalBottom,
            };
            break;
          case 'sw':
            newSelection = {
              ...selection,
              startX: x,
              startY: originalTop,
              endX: originalRight,
              endY: y,
            };
            break;
          case 'se':
            newSelection = {
              ...selection,
              startX: originalLeft,
              startY: originalTop,
              endX: x,
              endY: y,
            };
            break;
        }

        newSelection.width = Math.abs(newSelection.endX - newSelection.startX);
        newSelection.height = Math.abs(newSelection.endY - newSelection.startY);
        newSelection.displayWidth = newSelection.width;
        newSelection.displayHeight = newSelection.height;
        newSelection.cropWidth = newSelection.width;
        newSelection.cropHeight = newSelection.height;

        setSelection(newSelection);
      });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setIsDragging(false);
    setIsResizing(null);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
} 