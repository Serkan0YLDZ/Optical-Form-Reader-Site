import { Answer, Question } from "@/types";

export const ANSWER_OPTIONS: Answer[] = ['A', 'B', 'C', 'D', 'E'];

export const INITIAL_QUESTIONS: Question[] = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  answer: null
}));

export const ANSWER_COLORS = {
  selected: {
    light: 'bg-blue-500 text-white hover:bg-blue-600',
    dark: 'bg-blue-600 text-white hover:bg-blue-700'
  },
  unselected: {
    light: 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200',
    dark: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
  }
}; 