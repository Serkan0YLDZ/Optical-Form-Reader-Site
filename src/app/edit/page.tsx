"use client"

import { useState, useEffect, useCallback } from 'react';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import ModeToggle from '@/components/ModeToggle';
import EditPanel from '@/components/EditPanel';
import { useRouter } from 'next/navigation';

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
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
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
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const router = useRouter();

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

  const handleSelectionChange = useCallback((selection: Selection | null) => {
    if (!selection) {
      setHasSelection(false);
      setCurrentSelection(null);
      return;
    }

    // Görsel elementini bul
    const imageElement = document.querySelector('img') as HTMLImageElement;
    if (!imageElement) return;

    // Görselin gerçek boyutlarını al
    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;
    
    // Görselin ekrandaki boyutlarını al
    const displayedWidth = imageElement.width;
    const displayedHeight = imageElement.height;
    
    // Oran hesapla
    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    // Kırpma koordinatlarını hesapla
    const cropX = Math.round(selection.startX * scaleX) - 125;
    const cropY = Math.round(selection.startY * scaleY);
    const cropWidth = Math.round(selection.width * scaleX);
    const cropHeight = Math.round(selection.height * scaleY);

    // Selection nesnesini güncelle
    const updatedSelection: Selection = {
      ...selection,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      displayX: selection.startX,
      displayY: selection.startY,
      displayWidth: selection.width,
      displayHeight: selection.height
    };

    setHasSelection(true);
    setCurrentSelection(updatedSelection);
  }, []);

  // ImageSlider'a geçirilecek callback
  const onSelectionChange = useCallback((selection: Selection | null) => {
    handleSelectionChange(selection);
  }, [handleSelectionChange]);

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

  const handleCropAndAnalyze = async () => {
    try {
      console.log('Analiz başlatılıyor...');
      const results = [];
      
      for (const area of savedAreas) {
        console.log(`${area.name} için işlem başlatılıyor...`);
        
        // Kırpma işlemi
        const cropResponse = await fetch('/api/crop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropX: Math.round(area.selection.cropX),
            cropY: Math.round(area.selection.cropY),
            cropWidth: Math.round(area.selection.cropWidth),
            cropHeight: Math.round(area.selection.cropHeight),
            originalImageName: 'Image1.png',
            areaName: area.name
          })
        });

        const cropData = await cropResponse.json();
        console.log('Kırpma işlemi tamamlandı:', cropData);
        
        // Analiz işlemi
        const analyzeResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagePath: cropData.croppedImagePath,
            areaName: area.name
          })
        });

        const analyzeData = await analyzeResponse.json();
        console.log('Analiz işlemi tamamlandı:', analyzeData);
        
        results.push({
          areaName: area.name,
          summary: {
            total_questions: 20,
            correct: analyzeData.correct || 0,
            incorrect: analyzeData.incorrect || 0,
            empty: analyzeData.empty || 0,
            invalid: analyzeData.invalid || 0,
            accuracy: analyzeData.accuracy || 0
          },
          detailed_results: analyzeData.detailed_results || [],
          processed_image_path: cropData.croppedImagePath
        });
      }

      console.log('Tüm işlemler tamamlandı, sonuçlar:', results);
      
      // LocalStorage'a sonuçları kaydet
      localStorage.setItem('analysisResults', JSON.stringify(results));
      
      // Sonuçlar sayfasına yönlendir
      router.push('/results');
    } catch (error) {
      console.error('Kırpma ve analiz hatası:', error);
    }
  };

  return (
    <div className={`min-h-screen flex`}>
      {/* Sol üstteki butonlar */}
      <ModeToggle 
        currentMode={mode} 
        onModeChange={setMode}
        isDarkMode={isDarkMode}
      />

      {/* Sol taraf (ana içerik) */}
      <div className="flex-1 flex flex-col">
        
        {/* Alt bölüm - Modern tasarım */}
        <div className="flex-1 grid place-items-center bg-slate-800/20 rounded-none">
          <div className="w-full h-full rounded-none">
            <ImageSlider 
              images={images}
              currentIndex={currentIndex}
              onImageChange={setCurrentIndex}
              mode={mode}
              onSelectionChange={onSelectionChange}
              savedAreas={savedAreas}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Sabit sağ panel */}
      <div className="w-80 min-h-screen bg-slate-800 flex-shrink-0">
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
            onCropAndAnalyze={handleCropAndAnalyze}
          />
        </div>
      </div>
    </div>
  );
}