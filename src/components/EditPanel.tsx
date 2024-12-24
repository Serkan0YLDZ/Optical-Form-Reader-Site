import { useEffect } from "react";
import { useState } from "react";
import { Box, Flex, Text, Button, Separator } from '@radix-ui/themes';
import * as Form from "@radix-ui/react-form";
import { SelectionPlus, ChartBar, Sun, Moon, Checks, Pencil } from "phosphor-react";
import { CaretDown } from 'phosphor-react';
import { Selection, Area, Question, Result } from '@/types';
import * as Popover from '@radix-ui/react-popover';

interface EditPanelProps {
  results: Array<Result>;
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
  onUpdateAreaName: (id: string, newName: string) => void;
  onShowAllAnswerKeys: () => void;
  answerKeys: { [areaId: string]: Question[] };
  isButtonDisabled: boolean;
  setIsButtonDisabled: (disabled: boolean) => void;
  onQuestionCountChange: (areaId: string, count: number) => void;
  setShowAllAnswerKeys: (show: boolean) => void;
}

export default function EditPanel({  
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
  onUpdateAreaName,
  onShowAllAnswerKeys,
  answerKeys,
  isButtonDisabled,
  setIsButtonDisabled,
  onQuestionCountChange,
}: EditPanelProps) {
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (hasSelection) {
      const nextAreaNumber = savedAreas.length + 1;
      setAreaName(`Alan ${nextAreaNumber}`);
      setIsButtonDisabled(false);
    }
  }, [hasSelection, savedAreas.length, setAreaName, setIsButtonDisabled]);

  useEffect(() => {
    if (savedAreas.length === 0) {
      setIsButtonDisabled(true);
      return;
    }

    const allAreasHaveCompleteAnswers = savedAreas.every(area => {
      const areaAnswers = answerKeys[area.id];
      
      if (!areaAnswers || areaAnswers.length === 0) {
        return false;
      }

      return areaAnswers.every(question => 
        question.answer !== null && 
        question.answer !== undefined
      );
    });

    setIsButtonDisabled(!allAreasHaveCompleteAnswers);
  }, [savedAreas, answerKeys, setIsButtonDisabled]);

  const handleSaveArea = () => {
    if (currentSelection && areaName.trim()) {
      const newArea: Area = {
        id: crypto.randomUUID(),
        name: areaName,
        selection: currentSelection,
        croppedImageUrl: '',
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

  const handleAreaNameClick = (area: Area) => {
    setEditingAreaId(area.id);
    setEditingName(area.name);
  };

  const handleNameUpdate = (id: string) => {
    if (editingName.trim()) {
      onUpdateAreaName(id, editingName.trim());
      setEditingAreaId(null);
    }
  };

  return (
    <Flex direction="column" height="100vh" className="relative">
      <Box className={`flex-1 overflow-auto pb-24 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <Box p="4">
          <Flex direction="column" gap="4">
            <Flex justify="between" align="center" py="4">
              <Text 
                size="5" 
                weight="bold"
                className={isDarkMode ? 'text-white' : 'text-slate-800'}
              >
                Düzenleme Bölümü
              </Text>
              <Box className="rounded-full overflow-hidden">
                <button
                  onClick={onThemeToggle}
                  className={`p-3 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 hover:bg-slate-700 text-yellow-500' 
                      : 'bg-white hover:bg-slate-100 text-slate-700 shadow-md'
                  }`}
                >
                  {isDarkMode ? (
                    <Sun size={24} weight="bold" />
                  ) : (
                    <Moon size={24} weight="bold" />
                  )}
                </button>
              </Box>
            </Flex>

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
                    {editingAreaId === area.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => handleNameUpdate(area.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNameUpdate(area.id);
                          } else if (e.key === 'Escape') {
                            setEditingAreaId(null);
                          }
                        }}
                        autoFocus
                        className={`
                          px-2 py-1 rounded-md outline-none w-full
                          ${isDarkMode 
                            ? 'bg-slate-600 text-white border border-slate-500' 
                            : 'bg-white text-slate-700 border border-slate-300'
                          }
                        `}
                      />
                    ) : (
                      <Text 
                        className={`
                          cursor-pointer hover:opacity-70 transition-opacity
                          ${isDarkMode ? 'text-white' : 'text-slate-700'}
                        `}
                        onClick={() => handleAreaNameClick(area)}
                      >
                        {area.name}
                      </Text>
                    )}
                    
                    <Flex gap="2" align="center">
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <button
                            className={`
                              p-2 rounded-lg transition-colors
                              ${isDarkMode 
                                ? 'hover:bg-slate-700 text-slate-400' 
                                : 'hover:bg-slate-100 text-slate-600'
                              }
                            `}
                          >
                            <Pencil size={16} />
                          </button>
                        </Popover.Trigger>
                        
                        <Popover.Portal>
                          <Popover.Content
                            className={`
                              rounded-lg p-4 shadow-xl
                              ${isDarkMode 
                                ? 'bg-slate-800 border border-slate-700' 
                                : 'bg-white border border-slate-200'
                              }
                            `}
                            sideOffset={5}
                          >
                            <div className="space-y-3">
                              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Soru Sayısı
                              </p>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                defaultValue={answerKeys[area.id]?.length || 20}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value);
                                  if (count > 0 && count <= 100) {
                                    onQuestionCountChange(area.id, count);
                                  }
                                }}
                                className={`
                                  w-full px-3 py-2 rounded-lg
                                  ${isDarkMode 
                                    ? 'bg-slate-900 border-slate-700 text-white' 
                                    : 'bg-white border-slate-200 text-slate-900'
                                  }
                                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
                              />
                            </div>
                            <Popover.Arrow 
                              className={isDarkMode ? 'fill-slate-800' : 'fill-white'} 
                            />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>

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
                  </Flex>
                ))}
              </Flex>
            </Box>

            {savedAreas.length > 0 && (
              <div className="space-y-4">
                <button
                  onClick={onShowAllAnswerKeys}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                    ${isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                    transition-colors duration-200
                  `}
                >
                  <Flex align="center" gap="2">
                    <Checks size={20} weight="bold" />
                    <span className="font-medium">Cevap Anahtarı</span>
                  </Flex>
                  <CaretDown size={20} weight="bold" />
                </button>
              </div>
            )}
          </Flex>
        </Box>
      </Box>

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
        <Form.Root 
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (areaName.trim() && hasSelection && !isButtonDisabled) {
              handleSaveArea();
            }
          }}
        >
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
                disabled={isButtonDisabled || savedAreas.length === 0}
                color="green"
                className={`
                  w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200
                  ${isDarkMode
                    ? isButtonDisabled
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : isButtonDisabled
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }
                `}
              >
                <ChartBar size={20} weight="bold" className="mr-2" />
                Değerlendir 
              </Button>
            </Flex>
            <Separator size="4" />            
          </Flex>
        </Form.Root>
      </Box>
    </Flex>
  );
} 