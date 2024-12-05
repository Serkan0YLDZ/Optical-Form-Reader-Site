import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ImageControls } from './components/ImageControls';
import { AreaOverlay } from './components/AreaOverlay';
import { SelectionOverlay } from './components/SelectionOverlay';
import { ImageSliderProps, Selection } from './types';
import { useSelection } from './hooks/useSelection';
import { createSelectionHandlers } from './handlers/selectionHandlers';
import { ImageContainer } from './components/ImageContainer';

interface RenderProps {
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetTransform: () => void;
  instance: {
    transformState: {
      scale: number;
      positionX: number;
      positionY: number;
    };
  };
}

export default function ImageSlider({ images, currentIndex, onImageChange, mode, onSelectionChange, savedAreas }: ImageSliderProps) {
  const {
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
  } = useSelection(mode, onSelectionChange);

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = createSelectionHandlers(
    mode,
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
  );

  const handleReset = (resetTransform: () => void) => {
    resetTransform();
    return {
      position: { x: 0, y: 0 },
      scale: 1
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.01}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={false}
        disabled={mode === 'selector'}
      >
        {({ zoomIn, zoomOut, resetTransform, instance }: RenderProps) => (
          <>
            <div className="fixed bottom-6 left-6 z-50">
              <div className="bg-slate-800/80 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-slate-700/50">
                <ImageControls
                  onZoomIn={() => zoomIn(0.7)}
                  onZoomOut={() => zoomOut(0.7)}
                  onReset={() => handleReset(resetTransform)}
                  disabled={mode === 'selector'}
                />
              </div>
            </div>

            <ImageContainer
              images={images}
              currentIndex={currentIndex}
              savedAreas={savedAreas}
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - instance.transformState.positionX) / instance.transformState.scale;
                const y = (e.clientY - rect.top - instance.transformState.positionY) / instance.transformState.scale;
                handleMouseDown({ ...e, clientX: x, clientY: y });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - instance.transformState.positionX) / instance.transformState.scale;
                const y = (e.clientY - rect.top - instance.transformState.positionY) / instance.transformState.scale;
                handleMouseMove({ ...e, clientX: x, clientY: y });
              }}
              onMouseUp={handleMouseUp}
            />
          </>
        )}
      </TransformWrapper>

      {selection && (
        <SelectionOverlay
          selection={selection}
          isSelecting={isSelecting}
          isDragging={isDragging}
          isResizing={!!isResizing}
        />
      )}
    </div>
  );
}