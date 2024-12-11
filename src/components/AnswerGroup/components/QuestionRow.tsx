import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { Answer } from '@/types';
import { ANSWER_OPTIONS, ANSWER_COLORS } from '../constants';

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
    <div className={`
      flex items-center justify-between p-3 rounded-lg
      ${isDarkMode 
        ? 'bg-slate-800/50 hover:bg-slate-700/50' 
        : 'bg-slate-50 hover:bg-slate-100/80'
      }
      transition-colors duration-200
    `}>
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
                ? (isDarkMode ? ANSWER_COLORS.selected.dark : ANSWER_COLORS.selected.light)
                : (isDarkMode ? ANSWER_COLORS.unselected.dark : ANSWER_COLORS.unselected.light)
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