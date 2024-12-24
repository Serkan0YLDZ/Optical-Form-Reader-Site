import { SelectionOverlayProps } from '@/types';

export function SelectionOverlay({ selection, isSelecting, isDragging, isResizing }: SelectionOverlayProps) {
  const left = Math.min(selection.displayX, selection.displayX + selection.displayWidth);
  const top = Math.min(selection.displayY, selection.displayY + selection.displayHeight);
  const width = Math.abs(selection.displayWidth);
  const height = Math.abs(selection.displayHeight);

  return (
    <div
      className={`fixed border-2 border-blue-500 pointer-events-none ${
        (isSelecting || isDragging || isResizing) ? 'border-opacity-50' : ''
      }`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-0.5 rounded text-sm whitespace-nowrap">
        {Math.round(width)} x {Math.round(height)} px
      </div>

      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500" />
    </div>
  );
} 