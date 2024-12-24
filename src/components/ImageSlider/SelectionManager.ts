import { Selection } from '@/types';

export class SelectionManager {
  public isSelecting: boolean = false;
  public isDragging: boolean = false;
  public isResizing: string | null = null;
  private selection: Selection | null = null;
  private dragOffset = { x: 0, y: 0 };

  constructor(private onSelectionChange: (selection: Selection | null) => void) {}

  handleMouseDown(e: React.MouseEvent, currentSelection: Selection | null): void {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentSelection) {
      const corner = this.checkCornerClick(x, y, currentSelection);
      if (corner) {
        this.isResizing = corner;
        return;
      }

      if (this.isInsideSelection(x, y, currentSelection)) {
        this.startDragging(x, y, currentSelection);
        return;
      }
    }

    this.startNewSelection(x, y);
  }

  handleMouseMove(e: React.MouseEvent): void {
    if (!this.isSelecting && !this.isDragging && !this.isResizing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.isSelecting && this.selection) {
      this.updateSelection(x, y);
    } else if (this.isDragging && this.selection) {
      this.dragSelection(x, y);
    } else if (this.isResizing && this.selection) {
      this.resizeSelection(x, y);
    }
  }

  handleMouseUp(): void {
    this.isSelecting = false;
    this.isDragging = false;
    this.isResizing = null;
  }

  private startNewSelection(x: number, y: number): void {
    this.selection = { 
        startX: x, 
        startY: y, 
        endX: x, 
        endY: y, 
        width: 0, 
        height: 0, 
        displayX: x, 
        displayY: y, 
        displayWidth: 0, 
        displayHeight: 0,
        cropX: x,
        cropY: y,
        cropWidth: 0,
        cropHeight: 0
    };
    this.isSelecting = true;
    this.onSelectionChange(this.selection);
  }

  private updateSelection(x: number, y: number): void {
    if (!this.selection) return;
    this.selection.endX = x;
    this.selection.endY = y;
    this.selection.width = Math.abs(x - this.selection.startX);
    this.selection.height = Math.abs(y - this.selection.startY);
    this.onSelectionChange(this.selection);
  }

  private startDragging(x: number, y: number, currentSelection: Selection): void {
    this.isDragging = true;
    this.dragOffset = { x: x - currentSelection.startX, y: y - currentSelection.startY };
  }

  private dragSelection(x: number, y: number): void {
    if (!this.selection) return;
    const width = this.selection.width;
    const height = this.selection.height;
    this.selection.startX = x - this.dragOffset.x;
    this.selection.startY = y - this.dragOffset.y;
    this.selection.endX = this.selection.startX + width;
    this.selection.endY = this.selection.startY + height;
    this.onSelectionChange(this.selection);
  }

  private resizeSelection(x: number, y: number): void {
    if (!this.selection || !this.isResizing) return;
    
    const originalLeft = Math.min(this.selection.startX, this.selection.endX);
    const originalTop = Math.min(this.selection.startY, this.selection.endY);
    const originalRight = Math.max(this.selection.startX, this.selection.endX);
    const originalBottom = Math.max(this.selection.startY, this.selection.endY);

    switch (this.isResizing) {
      case 'nw':
        this.selection.startX = x;
        this.selection.startY = y;
        this.selection.endX = originalRight;
        this.selection.endY = originalBottom;
        break;
      case 'ne':
        this.selection.startX = originalLeft;
        this.selection.startY = y;
        this.selection.endX = x;
        this.selection.endY = originalBottom;
        break;
      case 'sw':
        this.selection.startX = x;
        this.selection.startY = originalTop;
        this.selection.endX = originalRight;
        this.selection.endY = y;
        break;
      case 'se':
        this.selection.startX = originalLeft;
        this.selection.startY = originalTop;
        this.selection.endX = x;
        this.selection.endY = y;
        break;
    }

    this.selection.width = Math.abs(this.selection.endX - this.selection.startX);
    this.selection.height = Math.abs(this.selection.endY - this.selection.startY);
    this.onSelectionChange(this.selection);
  }

  private checkCornerClick(x: number, y: number, selection: Selection): string | null {
    const corners = [
      { pos: 'nw', x: Math.min(selection.startX, selection.endX), y: Math.min(selection.startY, selection.endY) },
      { pos: 'ne', x: Math.max(selection.startX, selection.endX), y: Math.min(selection.startY, selection.endY) },
      { pos: 'sw', x: Math.min(selection.startX, selection.endX), y: Math.max(selection.startY, selection.endY) },
      { pos: 'se', x: Math.max(selection.startX, selection.endX), y: Math.max(selection.startY, selection.endY) }
    ];

    for (const corner of corners) {
      if (Math.abs(x - corner.x) < 10 && Math.abs(y - corner.y) < 10) {
        return corner.pos;
      }
    }
    return null;
  }

  private isInsideSelection(x: number, y: number, selection: Selection): boolean {
    const left = Math.min(selection.startX, selection.endX);
    const right = Math.max(selection.startX, selection.endX);
    const top = Math.min(selection.startY, selection.endY);
    const bottom = Math.max(selection.startY, selection.endY);

    return x >= left && x <= right && y >= top && y <= bottom;
  }
} 