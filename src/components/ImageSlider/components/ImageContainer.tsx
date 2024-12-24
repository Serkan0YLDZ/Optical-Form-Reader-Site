import { TransformComponent } from "react-zoom-pan-pinch";
import { Area } from "@/types";
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
  onMouseUp,
  isDarkMode
}: ImageContainerProps & { isDarkMode: boolean }) {
  return (
    <div
      className={`
        w-full h-full relative flex items-start justify-center
        ${isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-inner shadow-slate-900/50' 
          : 'bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 shadow-inner shadow-slate-200/50'
        }
        transition-all duration-500
        backdrop-blur-sm
        rounded-none
        border
        ${isDarkMode 
          ? 'border-slate-700/50' 
          : 'border-blue-100'
        }
      `}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div className={`
        absolute inset-0 
        ${isDarkMode
          ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/50 via-transparent to-transparent'
          : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent'
        }
      `} />
      
      <TransformComponent
        wrapperClass="!w-full !h-full flex items-start justify-center"
        contentClass="flex items-start justify-center pt-8"
      >
        <div className="relative flex items-start justify-center">
          <img 
              src={images[currentIndex]} 
              alt={`Görsel ${currentIndex + 1}`}
              className={`
                max-w-[90%] max-h-[90%] 
                object-contain select-none
                ${isDarkMode 
                  ? 'drop-shadow-2xl shadow-black/50' 
                  : 'drop-shadow-xl shadow-black/20'
                }
              `}
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