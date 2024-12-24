import { AreaOverlayProps } from '@/types';
import { AREA_COLORS } from '../constants';

export const AreaOverlay: React.FC<AreaOverlayProps> = ({ area, colorIndex }) => {
  const colors = AREA_COLORS[colorIndex % AREA_COLORS.length];

  return (
    <div
      className={`absolute pointer-events-none ${colors.bg} border-2 ${colors.border} rounded-lg shadow-lg`}
      style={{
        left: Math.min(area.selection.startX, area.selection.endX),
        top: Math.min(area.selection.startY, area.selection.endY),
        width: area.selection.width,
        height: area.selection.height,
      }}
    >
      <div 
        className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1.5 ${colors.text} text-white text-xs font-medium rounded-full shadow-lg whitespace-nowrap`}
      >
        {area.name}
      </div>

      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-white border-2 border-current"></div>
      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-white border-2 border-current"></div>
      <div className="absolute -left-1 -bottom-1 w-2 h-2 rounded-full bg-white border-2 border-current"></div>
      <div className="absolute -right-1 -bottom-1 w-2 h-2 rounded-full bg-white border-2 border-current"></div>
    </div>
  );
}; 