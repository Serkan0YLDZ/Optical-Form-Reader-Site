import { HandPointing, SelectionPlus } from "phosphor-react";

interface ModeToggleProps {
  currentMode: 'slider' | 'selector';
  onModeChange: (mode: 'slider' | 'selector') => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="bg-slate-800/80 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-slate-700/50">
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('slider')}
            className={`
              w-24 py-3 px-3 rounded-xl
              flex flex-col items-center gap-2
              transition-all duration-300
              ${currentMode === 'slider' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
              }
            `}
          >
            <HandPointing size={24} weight="bold" />
            <span className="text-xs">Kaydır</span>
          </button>

          <button
            onClick={() => onModeChange('selector')}
            className={`
              w-24 py-3 px-3 rounded-xl
              flex flex-col items-center gap-2
              transition-all duration-300
              ${currentMode === 'selector' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
              }
            `}
          >
            <SelectionPlus size={24} weight="bold" />
            <span className="text-xs">Seç</span>
          </button>
        </div>
      </div>
    </div>
  );
} 