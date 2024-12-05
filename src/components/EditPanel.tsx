import { useEffect } from "react";

import { useState } from "react";

interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
}

interface Area {
  id: string;
  name: string;
  selection: Selection;
}

interface EditPanelProps {
  results: any[];
  isDarkMode: boolean;
  onThemeToggle: () => void;
  hasSelection: boolean;
  currentSelection: Selection | null;
  onSaveArea: (area: Area) => void;
  onDeleteArea: (id: string) => void;
  savedAreas: Area[];
  onModeChange: (mode: 'slider' | 'selector') => void;
  areaName: string;
  setAreaName: (name: string) => void;
}

export default function EditPanel({ 
  results, 
  isDarkMode, 
  onThemeToggle,
  hasSelection,
  currentSelection,
  onSaveArea,
  onDeleteArea,
  savedAreas,
  onModeChange,
  areaName,
  setAreaName
}: EditPanelProps) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (hasSelection) {
      const nextAreaNumber = savedAreas.length + 1;
      setAreaName(`Alan ${nextAreaNumber}`);
      setIsButtonDisabled(false);
    }
  }, [hasSelection, savedAreas.length]);

  const handleSaveArea = () => {
    if (currentSelection && areaName.trim()) {
      const newArea: Area = {
        id: crypto.randomUUID(),
        name: areaName,
        selection: currentSelection
      };
      onSaveArea(newArea);
      setAreaName('');
      setIsButtonDisabled(true);
      onModeChange('slider');
      
      setTimeout(() => {
        onModeChange('selector');
      }, 100);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col gap-6">
      {/* Üst kısım - Tema Değiştirici */}
      <div className="p-4 flex justify-between items-center border-b border-slate-700">
        <h2 className="text-lg font-semibold text-gray-200">Düzenleme Bölümü</h2>
        <button
          onClick={onThemeToggle}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isDarkMode 
              ? "bg-slate-700 hover:bg-slate-600" 
              : "bg-white hover:bg-gray-100"
            }
          `}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          )}
        </button>
      </div>

      {/* Orta kısım - Sonuçlar Tablosu */}
      <div className="flex-1 overflow-y-auto p-4">
        {results.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Henüz sonuç bulunmamaktadır
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-slate-700">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Alan</th>
                  <th className="py-3 px-4">Değer</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-slate-700 hover:bg-slate-700">
                    <td className="py-2 px-4">{result.id}</td>
                    <td className="py-2 px-4">{result.area}</td>
                    <td className="py-2 px-4">{result.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Düzenleme Bölümü */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-white">Düzenleme Bölümü</h3>
        
        {/* Kayıtlı alanlar listesi */}
        <div className="flex flex-col gap-2">
          {savedAreas.map((area) => (
            <div 
              key={area.id}
              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
            >
              <span className="text-white">{area.name}</span>
              <button
                onClick={() => onDeleteArea(area.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alan ekleme formu - her zaman görünür */}
      <div className="mt-4">
        <input
          type="text"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          placeholder="Alan adı girin"
          className="w-full px-3 py-2 bg-slate-700 rounded-lg"
        />
        <button
          onClick={handleSaveArea}
          disabled={!areaName.trim() || !hasSelection || isButtonDisabled}
          className={`
            w-full mt-2 px-4 py-2 rounded-lg
            ${(!areaName.trim() || !hasSelection || isButtonDisabled)
              ? 'bg-slate-600 cursor-not-allowed text-gray-400'
              : 'bg-blue-500 hover:bg-blue-600 text-white'}
          `}
        >
          Alanı Kaydet
        </button>
      </div>
    </div>
  );
} 