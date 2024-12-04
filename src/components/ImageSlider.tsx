import { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageSliderProps {
  images: string[];
  currentIndex: number;
  onImageChange: (index: number) => void;
  mode: 'slider' | 'selector';
}

export default function ImageSlider({ images, currentIndex, onImageChange, mode }: ImageSliderProps) {
  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'selector') {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelection({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      });
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting && selection) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelection({
        ...selection,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      setIsSelecting(false);
    }
  };

  return (
    <div 
      className="w-full h-full bg-slate-800 rounded-lg relative flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom kontrolleri */}
            <div className="absolute bottom-6 right-6 z-40 flex gap-2">
              <button
                onClick={() => zoomIn(0.7)}
                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg text-white backdrop-blur-sm"
                disabled={mode === 'selector'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => zoomOut(0.7)}
                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg text-white backdrop-blur-sm"
                disabled={mode === 'selector'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-lg text-white backdrop-blur-sm"
                disabled={mode === 'selector'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <img 
                src={images[currentIndex]} 
                alt={`Görsel ${currentIndex + 1}`}
                className="max-w-[90%] max-h-[90%] object-contain select-none"
                draggable="false"
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Seçim dikdörtgeni */}
      {selection && (
        <div
          className="absolute border border-blue-500"
          style={{
            left: Math.min(selection.startX, selection.endX),
            top: Math.min(selection.startY, selection.endY),
            width: Math.abs(selection.endX - selection.startX),
            height: Math.abs(selection.endY - selection.startY),
          }}
        />
      )}

      {/* Görsel değiştirme butonları */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onImageChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-blue-500 scale-125' 
                : 'bg-gray-400 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}