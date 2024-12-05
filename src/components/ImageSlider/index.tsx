import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SelectionManager } from './SelectionManager';
import { ImageControls } from './components/ImageControls';
import { AreaOverlay } from './components/AreaOverlay';
import { SelectionOverlay } from './components/SelectionOverlay';
import { ImageSliderProps, Selection } from './types';
import { AREA_COLORS } from './constants';

export default function ImageSlider(props: ImageSliderProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const selectionManager = new SelectionManager(setSelection);

  useEffect(() => {
    props.onSelectionChange(selection);
  }, [selection, props.onSelectionChange]);

  return (
    <div className="flex-1 flex flex-col h-screen">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.01}
        maxScale={4}
        centerOnInit={true}
        limitToBounds={false}
        disabled={props.mode === 'selector'}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <ImageControls
              onZoomIn={() => zoomIn(0.7)}
              onZoomOut={() => zoomOut(0.7)}
              onReset={resetTransform}
              disabled={props.mode === 'selector'}
            />

            <div
              className="w-full h-full bg-slate-800 rounded-lg relative flex items-center justify-center"
              onMouseDown={(e) => selectionManager.handleMouseDown(e, selection)}
              onMouseMove={(e) => selectionManager.handleMouseMove(e)}
              onMouseUp={() => selectionManager.handleMouseUp()}
            >
              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full flex items-center justify-center relative"
              >
                <div className="relative">
                  <img
                    src={props.images[props.currentIndex]}
                    alt={`Görsel ${props.currentIndex + 1}`}
                    className="max-w-[90%] max-h-[90%] object-contain select-none"
                    draggable="false"
                  />

                  {props.savedAreas.map((area, index) => (
                    <AreaOverlay key={area.id} area={area} colorIndex={index} />
                  ))}
                </div>
              </TransformComponent>
            </div>

            {selection && (
              <SelectionOverlay
                selection={selection}
                isSelecting={selectionManager.isSelecting}
                isDragging={selectionManager.isDragging}
                isResizing={!!selectionManager.isResizing}
              />
            )}
          </>
        )}
      </TransformWrapper>
    </div>
  );
} 