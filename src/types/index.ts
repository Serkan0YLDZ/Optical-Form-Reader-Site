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
  croppedImageUrl: string;
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
  initialAnswers?: Question[];
  areaName: string;
}

export interface Question {
  id: number;
  answer: 'A' | 'B' | 'C' | 'D' | 'E' | null;
}

export interface DetailedResult {
  question: number;
  status: 'correct' | 'incorrect' | 'empty' | 'invalid';
  marked_answer: string | null;
  correct_answer: string;
}

export interface AnalysisSummary {
  total_questions: number;
  correct: number;
  incorrect: number;
  empty: number;
  invalid: number;
  accuracy: number;
}

export interface AnalysisResult {
  areaName: string;
  processed_image_path: string;
  summary: AnalysisSummary;
  detailed_results: DetailedResult[];
}

export interface ShowAnswerKey {
  areaId: string;
  areaName: string;
}

export type Answer = 'A' | 'B' | 'C' | 'D' | 'E' | null;

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

export interface Result {
  id: string;
  name: string;
  value: number;
}

export interface RenderProps {
  zoomIn: (step?: number) => void;
  zoomOut: (step?: number) => void;
  resetTransform: () => void;
  instance: {
    transformState: {
      scale: number;
      positionX: number;
      positionY: number;
    };
  };
}

export interface ErrorDialogProps {
  isDarkMode: boolean;
  showError: boolean;
  setShowError: (show: boolean) => void;
  errorMessage: string;
}

export interface ImageControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  disabled: boolean;
  isDarkMode: boolean;
}

export interface SelectionOverlayProps {
  selection: Selection;
  isSelecting: boolean;
  isDragging: boolean;
  isResizing: boolean;
}

export interface AreaOverlayProps {
  area: Area;
  colorIndex: number;
}

export interface ImageContainerProps {
  images: string[];
  currentIndex: number;
  savedAreas: Area[];
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export interface AnswerKeyOverlayProps {
  showAnswerKey: {
    areaId: string;
    areaName: string;
  } | null;
  isDarkMode: boolean;
  answerKeys: { [areaId: string]: Question[] };
  onAnswersChange: (answers: Question[], areaId: string) => void;
  onClose: () => void;
}

