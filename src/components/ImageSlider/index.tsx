import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SelectionManager } from './SelectionManager';
import { ImageControls } from './components/ImageControls';
import { AreaOverlay } from './components/AreaOverlay';
import { SelectionOverlay } from './components/SelectionOverlay';
import { ImageSliderProps, Selection } from '@/types';
import Image from 'next/image';

export default function ImageSlider(props: ImageSliderProps) {
  const [selection, setSelection] = useState<Selection | null>(null);
  const selectionManager = new SelectionManager(setSelection);

  const { onSelectionChange } = props;

  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

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
            <div className="fixed bottom-6 left-6 z-50">
              <div className="backdrop-blur-lg p-2 rounded-2xl shadow-xl border bg-slate-800/80 border-slate-700/50">
                <ImageControls
                  onZoomIn={() => zoomIn(0.7)}
                  onZoomOut={() => zoomOut(0.7)}
                  onReset={resetTransform}
                  disabled={props.mode === 'selector'}
                  isDarkMode={true}
                />
              </div>
            </div>

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
                  <Image
                    src={props.images[props.currentIndex]}
                    alt={`Görsel ${props.currentIndex + 1}`}
                    layout="responsive"
                    width={500}
                    height={300}
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