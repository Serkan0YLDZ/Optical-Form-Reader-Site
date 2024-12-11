import { useState, useEffect, useCallback } from 'react';
import { INITIAL_QUESTIONS } from './constants';
import { QuestionRow } from './components/QuestionRow';
import { ScrollArea } from '@radix-ui/themes';
import { Question, Answer } from '@/types';

interface AnswerGroupProps {
  onAnswersChange: (answers: Question[]) => void;
  isDarkMode: boolean;
  initialAnswers?: Question[];
  areaName: string;
}

export default function AnswerGroup({ 
  onAnswersChange, 
  isDarkMode,
  initialAnswers = [],
  areaName
}: AnswerGroupProps) {
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
    <div className={`
      w-full max-w-md mx-auto p-4 rounded-xl
      ${isDarkMode 
        ? 'bg-slate-900 border border-slate-800' 
        : 'bg-white border border-slate-200 shadow-lg'
      }
    `}>
      <h2 className={`
        text-lg font-semibold mb-4 px-3
        ${isDarkMode ? 'text-white' : 'text-slate-800'}
      `}>
        {areaName} için Cevap Anahtarı
      </h2>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
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