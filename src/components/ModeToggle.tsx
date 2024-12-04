interface ModeToggleProps {
  currentMode: 'slider' | 'selector';
  onModeChange: (mode: 'slider' | 'selector') => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="bg-slate-800/80 backdrop-blur-lg p-3 rounded-2xl shadow-xl border border-slate-700/50">
        <div className="space-y-2">
          <button
            onClick={() => onModeChange('slider')}
            className={`
              w-40 py-3 px-4 rounded-xl
              flex items-center gap-3
              transition-all duration-300
              ${currentMode === 'slider' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Kaydırma Modu
          </button>

          <button
            onClick={() => onModeChange('selector')}
            className={`
              w-40 py-3 px-4 rounded-xl
              flex items-center gap-3
              transition-all duration-300
              ${currentMode === 'selector' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            Alan Seçme Modu
          </button>
        </div>
      </div>
    </div>
  );
} 