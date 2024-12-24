import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Answer, ANSWER_OPTIONS } from '@/types';

interface QuestionRowProps {
  questionId: number;
  selectedAnswer: Answer;
  onAnswerChange: (answer: Answer) => void;
  isDarkMode: boolean;
}

export const QuestionRow = ({ 
  questionId, 
  selectedAnswer, 
  onAnswerChange,
  isDarkMode
}: QuestionRowProps) => {
  
  return (
    <div 
      style={{backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc'}}  // Inline stil deneyelim
      className={`
        flex items-center justify-between p-3 rounded-lg
        ${isDarkMode ? '!bg-slate-800' : '!bg-slate-50'}
        transition-colors duration-200
      `}
    >
      <span className={`
        font-medium text-sm w-8
        ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}
      `}>
        {questionId}. Soru
      </span>

      <ToggleGroup.Root
        type="single"
        value={selectedAnswer || ''}
        onValueChange={(value) => onAnswerChange(value as Answer)}
        className="flex gap-2"
      >
        {ANSWER_OPTIONS.map((option) => (
          <ToggleGroup.Item
            key={option}
            value={option as string}
            className={`
              w-10 h-10 rounded-lg font-medium text-sm
              flex items-center justify-center
              transition-all duration-200
              ${selectedAnswer === option 
                ? (isDarkMode 
                    ? 'bg-blue-600 text-white border-transparent' 
                    : 'bg-blue-500 text-white border-transparent shadow-sm')
                : (isDarkMode 
                    ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200')
              }
              ${!isDarkMode && !selectedAnswer 
                ? 'hover:border-blue-200 hover:text-blue-500' 
                : ''
              }
            `}
          >
            {option}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
    </div>
  );
}; 