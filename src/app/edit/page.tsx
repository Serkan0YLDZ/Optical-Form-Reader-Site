"use client"

import { useState, useEffect, useCallback, useContext } from 'react';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import ModeToggle from '@/components/ModeToggle';
import EditPanel from '@/components/EditPanel';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../theme-provider';
import AnswerGroup from '@/components/AnswerGroup';
import { Flex, Text } from '@radix-ui/themes';
import { Selection, Area, Question, ShowAnswerKey } from '@/types';

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
  const router = useRouter();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { isDarkMode: globalIsDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showAnswerKey, setShowAnswerKey] = useState<ShowAnswerKey | null>(null);
  const [answerKeys, setAnswerKeys] = useState<{ [areaId: string]: Question[] }>({});
  const [showAllAnswerKeys, setShowAllAnswerKeys] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const storedImages = localStorage.getItem('formImages');
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }

    // LocalStorage'dan tema tercihini al ve uygula
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }

    // İlk yüklemede sıfırlama işlemi için event tetikle
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

    // Seçim koordinatlarını düzenle
    const startX = Math.min(selection.startX, selection.endX);
    const startY = Math.min(selection.startY, selection.endY);
    const width = Math.abs(selection.width);
    const height = Math.abs(selection.height);

    // Kırpma koordinatlarını hesapla (negatif değerleri önle)
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

    // Selection nesnesini güncelle
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
      
      // Kısa bir süre sonra tekrar seç moduna geç
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
      console.log('Analiz başlatılıyor...');
      const results = [];
      
      for (const area of savedAreas) {
        console.log(`${area.name} için işlem başlatılıyor...`);
        
        // Cevap anahtarını doğru formatta hazırla
        const areaAnswers = answerKeys[area.id] || [];
        const answerKey = areaAnswers
          .filter(q => q.answer !== null)
          .map(q => q.answer?.toLowerCase() || 'x');

        console.log('Gönderilen cevap anahtarı:', answerKey); // Debug için

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
            areaName: area.name,
            areaId: area.id,
            answerKey: answerKey // Düzgün formatlı cevap anahtarı
          })
        });

        const analyzeData = await analyzeResponse.json();
        console.log('Analiz işlemi tamamlandı:', analyzeData);
        
        results.push({
          areaName: area.name,
          summary: {
            total_questions: analyzeData.total_questions,
            correct: analyzeData.correct,
            incorrect: analyzeData.incorrect,
            empty: analyzeData.empty,
            invalid: analyzeData.invalid,
            accuracy: analyzeData.accuracy
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

  const handleUpdateAreaName = (id: string, newName: string) => {
    setSavedAreas(savedAreas.map(area => 
      area.id === id ? { ...area, name: newName } : area
    ));
  };

  // Ctrl tuşu ile mod değişimi ve kaydetme için event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setMode(prevMode => prevMode === 'selector' ? 'slider' : 'selector');
      }
      if (e.ctrlKey) {
        if (e.key === 's') {
          // Varsayılan tarayıcı kaydetme davranışını engelle
          e.preventDefault();
          
          // Eğer geçerli bir seçim varsa ve alan adı girilmişse kaydet
          if (currentSelection && areaName.trim() && hasSelection) {
            handleSaveArea();
          }
        } else if (e.key === 'z') {
          // Varsayılan geri alma davranışını engelle
          e.preventDefault();
          
          // En son eklenen alanı sil
          if (savedAreas.length > 0) {
            const lastArea = savedAreas[savedAreas.length - 1];
            handleDeleteArea(lastArea.id);
          }
        } else if (!e.key) {
          // Sadece Ctrl tuşuna basıldığında modlar arasında geçiş yap
          setMode(prevMode => prevMode === 'selector' ? 'slider' : 'selector');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSelection, areaName, hasSelection, handleSaveArea, savedAreas, handleDeleteArea]);

  // Cevap anahtarı değişikliklerini yakalayacak fonksiyon
  const handleAnswersChange = useCallback((answers: Question[], areaId: string) => {
    // Debug için log
    console.log('Cevaplar güncelleniyor:', { areaId, answers });

    // useCallback ile memoize et
    requestAnimationFrame(() => {
      setAnswerKeys(prev => {
        const newAnswerKeys = { ...prev };
        newAnswerKeys[areaId] = answers;
        
        try {
          localStorage.setItem('answerKeys', JSON.stringify(newAnswerKeys));
          console.log('Güncellenmiş cevap anahtarları:', newAnswerKeys);
        } catch (error) {
          console.error('LocalStorage kayıt hatası:', error);
        }
        
        return newAnswerKeys;
      });
    });
  }, []);

  // EditPanel'e geçirilecek fonksiyon
  const handleShowAnswerKey = (areaId: string, areaName: string) => {
    setShowAnswerKey({ areaId, areaName });
  };

  // Tüm alanlar için cevap anahtarı gösterme fonksiyonu
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

  // Bitir ve Kaydet butonuna tıklandığında
  const handleFinishAndSave = useCallback(() => {
    // Tüm alanların cevaplarını kontrol et
    const allAreasAnswered = savedAreas.every(area => {
      const areaAnswers = answerKeys[area.id];
      console.log(`Alan ${area.id} cevapları:`, areaAnswers); // Debug için log
      
      return areaAnswers && 
             areaAnswers.length > 0 && 
             areaAnswers.every(q => q.answer !== null);
    });

    if (!allAreasAnswered) {
      alert('Lütfen tüm alanların cevaplarını eksiksiz doldurun.');
      return;
    }

    // Cevapları kaydet
    try {
      localStorage.setItem('answerKeys', JSON.stringify(answerKeys));
      console.log('Tüm cevaplar kaydedildi:', answerKeys); // Debug için log
      setShowAllAnswerKeys(false);
      setIsButtonDisabled(false);
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Cevaplar kaydedilirken bir hata oluştu.');
    }
  }, [savedAreas, answerKeys]);

  return (
    <div className="flex min-h-screen">
      {/* Sol üstteki butonlar */}
      <ModeToggle 
        currentMode={mode} 
        onModeChange={setMode}
        isDarkMode={globalIsDarkMode}
      />

      {/* Sol taraf (ana içerik) */}
      <div className="flex-1 flex flex-col">
        {/* Cevap anahtarı overlay */}
        {showAnswerKey && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4">
            <div className={`
              relative w-full max-w-2xl mx-auto p-6 rounded-2xl
              ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
              shadow-2xl
              max-h-[90vh] overflow-y-auto
              my-4
            `}>
              {/* Kapatma butonu - Sabit pozisyonda */}
              <div className="sticky top-0 right-0 z-10 flex justify-end mb-2">
                <button
                  onClick={() => setShowAnswerKey(null)}
                  className={`
                    p-2 rounded-full
                    ${isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-400 bg-slate-800' 
                      : 'hover:bg-slate-100 text-slate-600 bg-white'
                    }
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              

              {/* AnswerGroup bileşeni */}
              <div className="mt-4">
                <AnswerGroup 
                  key={showAnswerKey.areaId}
                  onAnswersChange={(answers: Question[]) => handleAnswersChange(answers, showAnswerKey.areaId)}
                  isDarkMode={isDarkMode}
                  initialAnswers={answerKeys[showAnswerKey.areaId] || []}
                  areaName={showAnswerKey.areaName}
                />
              </div>

              {/* Kaydet butonu */}
              <div className={`
                sticky bottom-0 mt-6 pb-4 pt-4 flex justify-end
                ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
              `}>
                <button
                  onClick={() => {
                    localStorage.setItem('answerKeys', JSON.stringify(answerKeys));
                    setShowAnswerKey(null);
                  }}
                  className={`
                    px-4 py-2 rounded-lg font-medium
                    ${isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  Cevap Anahtarını Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cevap Anahtarı Modal */}
        {showAllAnswerKeys && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`
              w-full max-w-4xl mx-auto p-6 rounded-2xl
              ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
              shadow-2xl
              max-h-[90vh] overflow-y-auto
            `}>
              {/* Başlık */}
              <div className={`sticky top-0 z-10 pb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <Flex justify="between" align="center">
                  <p></p>
                  <button
                    onClick={() => setShowAllAnswerKeys(false)}
                    className={`
                      p-2 rounded-full
                      ${isDarkMode 
                        ? 'hover:bg-slate-700 text-slate-400' 
                        : 'hover:bg-slate-100 text-slate-600'
                      }
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Flex>
              </div>

              {/* Alanlar için cevap anahtarları */}
              <div className="space-y-8">
                {savedAreas.map((area) => (
                  <div key={area.id} className="space-y-4">
                    <Text size="4" weight="medium" className={isDarkMode ? 'text-white' : 'text-slate-800'}>
                      {area.name}
                    </Text>
                    <AnswerGroup 
                      key={area.id}
                      onAnswersChange={(answers: Question[]) => handleAnswersChange(answers, area.id)}
                      isDarkMode={isDarkMode}
                      initialAnswers={answerKeys[area.id] || []}
                      areaName={area.name}
                    />
                  </div>
                ))}
              </div>

              {/* Bitir butonu */}
              <div className={`
                sticky bottom-0 mt-6 pt-4 pb-2
                ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
                border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
              `}>
                <button
                  onClick={handleFinishAndSave}
                  className={`
                    w-full px-4 py-3 rounded-lg font-medium
                    ${isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                    transition-colors duration-200
                  `}
                >
                  Bitir ve Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

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
            onShowAnswerKey={handleShowAnswerKey}
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