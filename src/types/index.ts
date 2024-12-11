export interface Selection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  width: number;
  height: number;
  displayX: number;
  displayY: number;
  displayWidth: number;
  displayHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

export interface Area {
    id: string;
    name: string;
    selection: Selection;
  }
  
  export interface ImageSliderProps {
    images: string[];
    currentIndex: number;
    onImageChange: (index: number) => void;
    mode: 'slider' | 'selector';
    onSelectionChange: (selection: Selection | null) => void;
    savedAreas: Area[];
  } 

export interface AnswerGroupProps {
  onAnswersChange: (answers: Question[]) => void;
  isDarkMode: boolean;
} 

export interface Area {
  id: string;
  name: string;
  selection: Selection;
}

export interface Question {
  id: number;
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

export interface AnalysisResult {
  areaName: string;
  summary: {
    total_questions: number;
    correct: number;
    incorrect: number;
    empty: number;
    invalid: number;
    accuracy: number;
  };
  detailed_results: DetailedResult[];
  processed_image_path: string;
}

export interface DetailedResult {
  question: number;
  marked_answer: string | null;
  correct_answer: string;
  status: string;
}

// Component prop tipleri
export interface ShowAnswerKey {
  areaId: string;
  areaName: string;
}

export type Answer = 'A' | 'B' | 'C' | 'D' | 'E' | null; 