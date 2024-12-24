"use client"

import { useState, useEffect, useCallback, useContext } from 'react';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import ModeToggle from '@/components/ModeToggle';
import EditPanel from '@/components/EditPanel';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../theme-provider';
import { Selection, Area, Question } from '@/types';
import AllAnswerKeysModal from '@/components/AllAnswerKeys';

export default function EditPage() {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<'slider' | 'selector'>('slider');
  const [results] = useState([]);
  const [hasSelection, setHasSelection] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const [savedAreas, setSavedAreas] = useState<Area[]>([]);
  const [areaName, setAreaName] = useState('');
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { isDarkMode: globalIsDarkMode, toggleTheme } = useContext(ThemeContext);
  const [answerKeys, setAnswerKeys] = useState<{ [areaId: string]: Question[] }>({});
  const [showAllAnswerKeys, setShowAllAnswerKeys] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const imageUrl = localStorage.getItem('formImageUrl');
    if (imageUrl) {
      setImages([imageUrl]);
    }

    if (isFirstLoad) {
      const resetButton = document.querySelector('[title="Sıfırla"]');
      if (resetButton) {
        (resetButton as HTMLButtonElement).click();
      }
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    const stored = localStorage.getItem('answerKeys');
    if (stored) {
      setAnswerKeys(JSON.parse(stored));
    }
  }, []);

  const handleSelectionChange = useCallback((selection: Selection | null) => {
    if (!selection) {
      setHasSelection(false);
      setCurrentSelection(null);
      return;
    }

    const imageElement = document.querySelector('img') as HTMLImageElement;
    if (!imageElement) return;

    const naturalWidth = imageElement.naturalWidth;
    const naturalHeight = imageElement.naturalHeight;
    
    const displayedWidth = imageElement.width;
    const displayedHeight = imageElement.height;
    
    const scaleX = naturalWidth / displayedWidth;
    const scaleY = naturalHeight / displayedHeight;

    const startX = Math.min(selection.startX, selection.endX);
    const startY = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.width);
    const height = Math.abs(selection.height);

    const cropX = Math.max(0, Math.round(startX * scaleX)) - 125;
    const cropY = Math.max(0, Math.round(startY * scaleY));
    const cropWidth = Math.min(
      Math.round(width * scaleX),
      naturalWidth - cropX
    );
    const cropHeight = Math.min(
      Math.round(height * scaleY),
      naturalHeight - cropY
    );

    const updatedSelection: Selection = {
      ...selection,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      displayX: startX,
      displayY: startY,
      displayWidth: width,
      displayHeight: height
    };

    setHasSelection(true);
    setCurrentSelection(updatedSelection);
  }, []);

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
        },
        croppedImageUrl: ''
      };
      setSavedAreas([...savedAreas, newArea]);
      setMode('slider');
      
      setTimeout(() => {
        setMode('selector');
      }, 100);
    }
  };

  const handleDeleteArea = (id: string) => {
    setSavedAreas(savedAreas.filter(area => area.id !== id));
  };

  const handleCropAndAnalyze = async () => {
    try {
      const results = [];
      
      for (const area of savedAreas) {
        const areaAnswers = answerKeys[area.id] || [];
        const answerKey = areaAnswers
          .filter(q => q.answer !== null)
          .map(q => q.answer?.toLowerCase() || 'x');

        const cropResponse = await fetch('/api/crop', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cropX: area.selection.cropX,
            cropY: area.selection.cropY,
            cropWidth: area.selection.cropWidth,
            cropHeight: area.selection.cropHeight,
            originalImageName: images[currentIndex],
            areaName: area.name
          }),
        });

        const cropData = await cropResponse.json();
        
        const analyzeResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imagePath: cropData.croppedImagePath,
            answerKey: answerKey,
            areaName: area.name,
            imageId: images[currentIndex]
          }),
        });

        const analyzeData = await analyzeResponse.json();
        results.push(analyzeData);
      }

      localStorage.setItem('analysisResults', JSON.stringify(results));
      router.push('/results');
      
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } 
  };

  const handleUpdateAreaName = (id: string, newName: string) => {
    setSavedAreas(savedAreas.map(area => 
      area.id === id ? { ...area, name: newName } : area
    ));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setMode(prevMode => prevMode === 'selector' ? 'slider' : 'selector');
      }
      if (e.ctrlKey) {
        if (e.key === 's') {
          e.preventDefault();
      
          if (currentSelection && areaName.trim() && hasSelection) {
            handleSaveArea();
          }
        } else if (e.key === 'z') {
          e.preventDefault();
          
          if (savedAreas.length > 0) {
            const lastArea = savedAreas[savedAreas.length - 1];
            handleDeleteArea(lastArea.id);
          }
        } else if (!e.key) {
          setMode(prevMode => prevMode === 'selector' ? 'slider' : 'selector');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSelection, areaName, hasSelection, handleSaveArea, savedAreas, handleDeleteArea]);

  const handleAnswersChange = useCallback((answers: Question[], areaId: string) => {
    requestAnimationFrame(() => {
      setAnswerKeys(prev => {
        const newAnswerKeys = { ...prev };
        newAnswerKeys[areaId] = answers;
        localStorage.setItem('answerKeys', JSON.stringify(newAnswerKeys));       
        return newAnswerKeys;
      });
    });
  }, []);

  const handleShowAllAnswerKeys = useCallback(() => {
    setShowAllAnswerKeys(true);
  }, []);

  const handleQuestionCountChange = (areaId: string, count: number) => {
    const currentAnswers = answerKeys[areaId] || [];
    const newAnswers = Array.from({ length: count }, (_, index) => {
      return currentAnswers[index] || { id: index + 1, answer: null };
    });

    setAnswerKeys(prev => {
      const updated = {
        ...prev,
        [areaId]: newAnswers
      };
      localStorage.setItem('answerKeys', JSON.stringify(updated));
      return updated;
    });
  };

  const handleFinishAndSave = useCallback(() => {
    const allAreasAnswered = savedAreas.every(area => {
      const areaAnswers = answerKeys[area.id];
      return areaAnswers && 
             areaAnswers.length > 0 && 
             areaAnswers.every(q => q.answer !== null);
    });

    if (!allAreasAnswered) {
      alert('Lütfen tüm alanların cevaplarını eksiksiz doldurun.');
      return;
    }

    localStorage.setItem('answerKeys', JSON.stringify(answerKeys));
      setShowAllAnswerKeys(false);
      setIsButtonDisabled(false);
  }, [savedAreas, answerKeys]);

  return (
    <div className="flex min-h-screen">
      <ModeToggle 
        currentMode={mode} 
        onModeChange={setMode}
        isDarkMode={globalIsDarkMode}
      />

      {/* Sol taraf (ana içerik) */}
      <div className="flex-1 flex flex-col">
        
        {/* Cevap Anahtarı Bölümü */}
        <AllAnswerKeysModal
          show={showAllAnswerKeys}
          isDarkMode={globalIsDarkMode}
          savedAreas={savedAreas}
          answerKeys={answerKeys}
          onClose={() => setShowAllAnswerKeys(false)}
          onAnswersChange={handleAnswersChange}
          onFinishAndSave={handleFinishAndSave}
        />

        {/* Görsel Düzenleme Bölümü */}
        <div className="flex-1 grid place-items-center bg-slate-800/20 rounded-none">
          <div className="w-full h-full rounded-none">
            <ImageSlider 
              images={images}
              currentIndex={currentIndex}
              onImageChange={setCurrentIndex}
              mode={mode}
              onSelectionChange={onSelectionChange}
              savedAreas={savedAreas}
              isDarkMode={globalIsDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Sabit sağ panel */}
      <div className="w-80 min-h-screen bg-slate-800 flex-shrink-0">
        <div className="sticky top-0 h-screen">
          <EditPanel 
            results={results} 
            isDarkMode={globalIsDarkMode}
            onThemeToggle={toggleTheme}
            hasSelection={hasSelection}
            currentSelection={currentSelection}
            onSaveArea={handleSaveArea}
            onDeleteArea={handleDeleteArea}
            savedAreas={savedAreas}
            onModeChange={setMode}
            areaName={areaName}
            setAreaName={setAreaName}
            onCropAndAnalyze={handleCropAndAnalyze}
            onUpdateAreaName={handleUpdateAreaName}
            onShowAllAnswerKeys={handleShowAllAnswerKeys}
            answerKeys={answerKeys}
            isButtonDisabled={isButtonDisabled}
            setIsButtonDisabled={setIsButtonDisabled}
            onQuestionCountChange={handleQuestionCountChange}
            setShowAllAnswerKeys={setShowAllAnswerKeys}
          />
        </div>
      </div>
    </div>
  );
}