import { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollArea } from '@radix-ui/themes';
import { Question, Answer, INITIAL_QUESTIONS} from '@/types';
import { QuestionRow } from './QuestionRow';
import { ThemeContext } from '@/app/theme-provider';

interface AnswerGroupProps {
  onAnswersChange: (answers: Question[]) => void;
  initialAnswers: Question[];
  areaName: string;
  isDarkMode: boolean;
}

export default function AnswerGroup({ 
  onAnswersChange, 
  areaName,
  initialAnswers = []
}: AnswerGroupProps) {
  const { isDarkMode } = useContext(ThemeContext);
  const [questions, setQuestions] = useState<Question[]>(() => 
    initialAnswers.length > 0 ? initialAnswers : INITIAL_QUESTIONS
  );

  useEffect(() => {
    onAnswersChange(questions);
  }, [questions, onAnswersChange]);

  const handleAnswerChange = useCallback((questionId: number, answer: Answer) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId ? { ...q, answer } : q
      )
    );
  }, []);

  useEffect(() => {
    if (initialAnswers.length > 0) {
      setQuestions(initialAnswers);
    }
  }, [initialAnswers]);

  return (
    <div className={`p-4 rounded-lg ${
      isDarkMode 
        ? 'bg-slate-900/50 text-white'
        : 'bg-white text-slate-900'
    }`}>
      <h2 
        className={`
          text-lg font-semibold mb-4 px-3 text-center
          ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}
        `}
      >
        {areaName} için Cevap Anahtarı 
      </h2>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2 w-3/5 mx-auto">
          {questions.map((question) => (
            <QuestionRow
              key={question.id}
              questionId={question.id}
              selectedAnswer={question.answer}
              onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 