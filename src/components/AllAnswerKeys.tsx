import React, { useContext } from 'react';
import { Flex } from '@radix-ui/themes';
import { Question, Area } from '@/types';
import AnswerGroup from './AnswerGroup';
import { ThemeContext } from '@/app/theme-provider';


interface AllAnswerKeysModalProps {
  show: boolean;
  isDarkMode: boolean;
  savedAreas: Area[];
  answerKeys: { [areaId: string]: Question[] };
  onClose: () => void;
  onAnswersChange: (answers: Question[], areaId: string) => void;
  onFinishAndSave: () => void;
}

const ModalHeader: React.FC<{ isDarkMode: boolean; onClose: () => void }> = ({ 
  isDarkMode, 
  onClose 
}) => (
  <div className="sticky top-0 z-10 pb-6">
    <Flex justify="between" align="center">
      <p></p>
      <CloseButton isDarkMode={isDarkMode} onClick={onClose} />
    </Flex>
  </div>
);

const AnswerAreas: React.FC<{
  savedAreas: Area[];
  isDarkMode: boolean;
  answerKeys: { [areaId: string]: Question[] };
  onAnswersChange: (answers: Question[], areaId: string) => void;
}> = ({ 
  savedAreas, 
  isDarkMode, 
  answerKeys, 
  onAnswersChange 
}) => (
  <div className="space-y-8">
    {savedAreas.map((area) => (
      <div key={area.id}>
        <AnswerGroup
          isDarkMode={isDarkMode}
          initialAnswers={answerKeys[area.id] || []}
          areaName={area.name}
          onAnswersChange={(answers) => onAnswersChange(answers, area.id)}
        />
      </div>
    ))}
  </div>
);

const CloseButton: React.FC<{ isDarkMode: boolean; onClick: () => void }> = ({ 
  isDarkMode, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`
      p-2 rounded-full
      ${isDarkMode 
        ? 'hover:bg-slate-700 text-slate-400' 
        : 'hover:bg-slate-100 text-slate-600'
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
);

const FinishButton: React.FC<{ isDarkMode: boolean; onClick: () => void }> = ({ 
  isDarkMode, 
  onClick 
}) => (
  <div 
    className={`
      sticky bottom-0 mt-6 pt-4 pb-2
      ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
      border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}
    `}
  >
    <button
      onClick={onClick}
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
);

const AllAnswerKeysModal: React.FC<AllAnswerKeysModalProps> = ({
  show,
  savedAreas,
  answerKeys,
  onClose,
  onAnswersChange,
  onFinishAndSave
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        className={`
          w-full max-w-2xl mx-auto p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto
          ${isDarkMode ? 'bg-slate-800' : 'bg-white'}
        `}
      >
        <ModalHeader isDarkMode={isDarkMode} onClose={onClose} />
        
        <AnswerAreas 
          savedAreas={savedAreas}
          isDarkMode={isDarkMode}
          answerKeys={answerKeys}
          onAnswersChange={onAnswersChange}
        />
        
        <FinishButton isDarkMode={isDarkMode} onClick={onFinishAndSave} />
      </div>
    </div>
  );
};

export default AllAnswerKeysModal;