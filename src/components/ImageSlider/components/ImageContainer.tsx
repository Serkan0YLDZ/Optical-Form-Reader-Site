import { TransformComponent } from "react-zoom-pan-pinch";
import { Area } from "../types";
import { AreaOverlay } from "./AreaOverlay";

interface ImageContainerProps {
  images: string[];
  currentIndex: number;
  savedAreas: Area[];
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export function ImageContainer({
  images,
  currentIndex,
  savedAreas,
  onMouseDown,
  onMouseMove,
  onMouseUp
}: ImageContainerProps) {
  return (
    <div
      className="w-full h-full bg-slate-800 rounded-lg relative flex items-center justify-center"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <TransformComponent
        wrapperClass="!w-full !h-full"
        contentClass="!w-full !h-full flex items-center justify-center relative"
      >
        <div className="relative">
          <img 
            src={images[currentIndex]} 
            alt={`Görsel ${currentIndex + 1}`}
            className="max-w-[90%] max-h-[90%] object-contain select-none"
            draggable="false"
          />
          
          {savedAreas.map((area, index) => (
            <AreaOverlay key={area.id} area={area} colorIndex={index} />
          ))}
        </div>
      </TransformComponent>
    </div>
  );
} 