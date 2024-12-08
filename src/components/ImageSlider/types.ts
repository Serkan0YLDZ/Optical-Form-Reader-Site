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