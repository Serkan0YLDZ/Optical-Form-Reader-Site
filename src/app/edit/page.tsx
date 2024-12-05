"use client"

import { useState, useEffect } from 'react';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import ModeToggle from '@/components/ModeToggle';
import EditPanel from '@/components/EditPanel';

interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
  displayX: number;
  displayY: number;
  displayWidth: number;
  displayHeight: number;
}

interface Area {
  id: string;
  name: string;
  selection: Selection;
}

export default function EditPage() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'slider' | 'selector'>('slider');
  const [results, setResults] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hasSelection, setHasSelection] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [savedAreas, setSavedAreas] = useState<Area[]>([]);
  const [areaName, setAreaName] = useState('');

  useEffect(() => {
    const storedImages = localStorage.getItem('formImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }

    // LocalStorage'dan tema tercihini al
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSelectionChange = (selection: Selection | null) => {
    setHasSelection(!!selection);
    setCurrentSelection(selection);
  };

  const handleSaveArea = () => {
    if (currentSelection) {
      const newArea: Area = {
        id: crypto.randomUUID(),
        name: areaName,
        selection: {
          ...currentSelection,
          displayX: currentSelection.startX,
          displayY: currentSelection.startY,
          displayWidth: currentSelection.width,
          displayHeight: currentSelection.height
        }
      };
      setSavedAreas([...savedAreas, newArea]);
      setMode('slider');
    }
  };

  const handleDeleteArea = (id: string) => {
    setSavedAreas(savedAreas.filter(area => area.id !== id));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'} flex`}>
      {/* Sol üstteki butonlar */}
      <ModeToggle 
        currentMode={mode} 
        onModeChange={setMode} 
      />

      {/* Sol taraf (ana içerik) */}
      <div className="flex-1 flex flex-col">
        {/* Üst bölüm */}
        <div className="flex-none">
          {/* Üst bölüm içeriği */}
        </div>
        
        {/* Alt bölüm - Modern tasarım */}
        <div className="flex-1 grid place-items-center bg-slate-800/20 rounded-lg mx-6">
          <div className="w-full h-full">
            <ImageSlider 
              images={images}
              currentIndex={currentIndex}
              onImageChange={setCurrentIndex}
              mode={mode}
              onSelectionChange={handleSelectionChange}
              savedAreas={savedAreas}
            />
          </div>
        </div>
      </div>

      {/* Sabit sağ panel */}
      <div className="w-80 min-h-screen bg-slate-800 border-l border-slate-700 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <EditPanel 
            results={results} 
            isDarkMode={isDarkMode}
            onThemeToggle={handleThemeToggle}
            hasSelection={hasSelection}
            currentSelection={currentSelection}
            onSaveArea={handleSaveArea}
            onDeleteArea={handleDeleteArea}
            savedAreas={savedAreas}
            onModeChange={setMode}
            areaName={areaName}
            setAreaName={setAreaName}
          />
        </div>
      </div>
    </div>
  );
}