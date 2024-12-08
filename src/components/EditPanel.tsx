import { useEffect } from "react";
import { useState } from "react";
import { Box, Container, Flex, Text, Button, Separator, ScrollArea } from '@radix-ui/themes';
import * as Form from "@radix-ui/react-form";
import { SelectionPlus, ChartBar } from "phosphor-react";

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
  onCropAndAnalyze: () => Promise<void>;
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
  setAreaName,
  onCropAndAnalyze,
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
    <Flex direction="column" height="100vh" className="relative">
      {/* Üst kısım - Scrollable içerik */}
      <Box className={`flex-1 overflow-auto pb-24 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <Box p="4">
          <Flex direction="column" gap="4">
            {/* Üst kısım - Tema Değiştirici */}
            <Flex justify="between" align="center" py="4">
              <Text 
                size="5" 
                weight="bold"
                className={isDarkMode ? 'text-white' : 'text-slate-800'}
              >
                Düzenleme Bölümü
              </Text>
              <Button 
                variant="soft" 
                onClick={onThemeToggle}
                className={`
                  w-10 h-10 p-0 flex items-center justify-center
                  ${isDarkMode 
                    ? 'bg-slate-700 hover:bg-slate-600' 
                    : 'bg-slate-100 hover:bg-slate-200'
                  }
                `}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </Button>
            </Flex>

            {/* Düzenleme Bölümü */}
            <Box className="pb-4">
              <Flex direction="column" gap="2">
                {savedAreas.map((area) => (
                  <Flex 
                    key={area.id} 
                    justify="between" 
                    align="center" 
                    p="3" 
                    className={`
                      rounded-lg
                      ${isDarkMode 
                        ? 'bg-slate-700/50' 
                        : 'bg-slate-100 border border-slate-200'
                      }
                    `}
                  >
                    <Text className={isDarkMode ? 'text-white' : 'text-slate-700'}>
                      {area.name}
                    </Text>
                    <Button 
                      variant="ghost" 
                      color="red" 
                      onClick={() => onDeleteArea(area.id)}
                      className={isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-red-50'}
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
                    </Button>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Alt kısım - Sabit form ve butonlar */}
      <Box 
        position="fixed" 
        bottom="0" 
        right="0"
        width="320px"
        className={`
          ${isDarkMode 
            ? 'bg-slate-800 border-t border-slate-700' 
            : 'bg-white border-t border-slate-200 shadow-lg'
          }
        `}
      >
        <Form.Root className="p-4">
          <Flex direction="column" gap="2">
            <Form.Field name="areaName">
              <Form.Control asChild>
                <input
                  type="text"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  placeholder="Alan adı girin"
                  className={`
                    w-full px-3 py-2 rounded-lg outline-none
                    ${isDarkMode 
                      ? 'bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:ring-2 focus:ring-blue-500' 
                      : 'bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 focus:ring-2 focus:ring-blue-500'
                    }
                  `}
                />
              </Form.Control>
              {!areaName.trim() && hasSelection && (
                <Form.Message className="text-xs text-red-400 mt-1">
                  Lütfen alan adı girin
                </Form.Message>
              )}
            </Form.Field>
            
            <Flex gap="2" justify="between">
              <Button 
                onClick={handleSaveArea}
                disabled={!areaName.trim() || !hasSelection || isButtonDisabled}
                className={`
                  flex items-center justify-center px-4 py-2 rounded-lg
                  ${isDarkMode 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-700 disabled:text-slate-500' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-slate-100 disabled:text-slate-400'
                  }
                `}
              >
                <SelectionPlus size={20} weight="bold" className="mr-2" />
                Alanı Kaydet
              </Button>

              <Button
                type="button"
                onClick={() => onCropAndAnalyze()}
                disabled={savedAreas.length === 0}
                color="green"
                className={`
                  flex items-center justify-center px-4 py-2 rounded-lg
                  ${isDarkMode 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-700 disabled:text-slate-500' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-slate-100 disabled:text-slate-400'
                  }
                `}
              >
                <ChartBar size={20} weight="bold" className="mr-2" />
                Değerlendir 
              </Button>
            </Flex>
          </Flex>
        </Form.Root>
      </Box>
    </Flex>
  );
} 