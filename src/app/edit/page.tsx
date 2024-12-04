"use client"

import { useState, useEffect } from 'react';
import ImageSlider from '@/components/ImageSlider';
import ModeToggle from '@/components/ModeToggle';
import ResultsTable from '@/components/ResultsTable';

export default function EditPage() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'slider' | 'selector'>('slider');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const storedImages = localStorage.getItem('formImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sol üstteki butonlar */}
      <ModeToggle 
        currentMode={mode} 
        onModeChange={setMode} 
      />

      {/* Sol taraf (ana içerik) */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Üst bölüm */}
        
        {/* Alt bölüm */}
        <div className="h-1/2">
          <ImageSlider 
            images={images}
            currentIndex={currentIndex}
            onImageChange={setCurrentIndex}
            mode={mode}
          />
        </div>
      </div>

      {/* Sabit sağ panel */}
      <div className="w-80 min-h-screen bg-slate-800 border-l border-slate-700 flex-shrink-0">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <ResultsTable results={results} />
        </div>
      </div>
    </div>
  );
}