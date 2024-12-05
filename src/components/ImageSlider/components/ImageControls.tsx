interface ImageControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  disabled: boolean;
}

export const ImageControls: React.FC<ImageControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onReset,
  disabled
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onZoomIn}
        disabled={disabled}
        className={`
          w-24 py-3 px-3 rounded-xl
          flex flex-col items-center gap-2
          transition-all duration-300
          ${disabled 
            ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed' 
            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-xs">Yakınlaş</span>
      </button>

      <button
        onClick={onZoomOut}
        disabled={disabled}
        className={`
          w-24 py-3 px-3 rounded-xl
          flex flex-col items-center gap-2
          transition-all duration-300
          ${disabled 
            ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed' 
            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
        <span className="text-xs">Uzaklaş</span>
      </button>

      <button
        onClick={onReset}
        disabled={disabled}
        className={`
          w-24 py-3 px-3 rounded-xl
          flex flex-col items-center gap-2
          transition-all duration-300
          ${disabled 
            ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed' 
            : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700/80 hover:text-white'
          }
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs">Sıfırla</span>
      </button>
    </div>
  );
}; 