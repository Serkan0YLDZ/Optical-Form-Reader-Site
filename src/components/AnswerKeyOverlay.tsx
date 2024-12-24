import React from 'react';
import { Question } from '@/types';
import AnswerGroup from './AnswerGroup';
import { AnswerKeyOverlayProps } from '@/types';

const AnswerKeyOverlay: React.FC<AnswerKeyOverlayProps> = ({
  showAnswerKey,
  isDarkMode,
  answerKeys,
  onAnswersChange,
  onClose,
}) => {
  if (!showAnswerKey) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-black/50' : 'bg-slate-500/30 backdrop-blur-sm'
    }`}>
      <div className={`relative w-full max-w-2xl rounded-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white border border-slate-200'
      }`}>
        <div className="sticky top-0 right-0 z-10 flex justify-end mb-2">
          <button
            onClick={onClose}
            className={`
              p-2 rounded-full transition-colors
              ${isDarkMode 
                ? 'hover:bg-slate-700 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <AnswerGroup 
            key={showAnswerKey.areaId}
            onAnswersChange={(answers: Question[]) => 
              onAnswersChange(answers, showAnswerKey.areaId)
            }
            isDarkMode={isDarkMode}
            initialAnswers={answerKeys[showAnswerKey.areaId] || []}
            areaName={showAnswerKey.areaName}
          />
        </div>

        <div className={`flex items-center justify-end gap-4 p-4 border-t ${
          isDarkMode 
            ? 'border-gray-600 bg-slate-800' 
            : 'border-slate-200 bg-white'
        }`}>
          <button
            onClick={() => {
              localStorage.setItem('answerKeys', JSON.stringify(answerKeys));
              onClose();
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
  );
};

export default AnswerKeyOverlay;