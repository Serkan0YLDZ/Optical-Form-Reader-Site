import cv2
import numpy as np
from typing import List, Tuple, Dict
import string
import json
import sys
import os

class FormProcessor:
    def __init__(self):
        self.y_threshold = 15
        self.filling_threshold = 0.3

    def process_image(self, image_path: str, answer_key: List[str]) -> None:
        try:
            if not os.path.exists(image_path):
                raise Exception(f"Dosya bulunamadı: {image_path}")
            
            sys.stderr.write(f"Debug - İşlem başlıyor\n")
            sys.stderr.write(f"Image path: {image_path}\n")
            sys.stderr.write(f"Answer key: {answer_key}\n")
            
            image = cv2.imread(image_path)
            if image is None:
                raise Exception("Görüntü okunamadı")
            
            _, circles = self.detect_circles_and_marks(image, answer_key)
            if not circles:
                raise Exception("Hiç daire bulunamadı")

            groups = self.group_circles(circles)
            results, detailed_results = self.analyze_groups(groups, answer_key)
            
            total_questions = len(answer_key)
            accuracy = (results['correct'] / total_questions) * 100 if total_questions > 0 else 0
            
            formatted_results = []
            for question_num, status, marked, correct in detailed_results:
                formatted_results.append({
                    'question': question_num,
                    'marked_answer': marked,
                    'correct_answer': correct,
                    'status': status
                })
            
            output = {
                'total_questions': total_questions,
                'correct': results['correct'],
                'incorrect': results['incorrect'],
                'empty': results['empty'],
                'invalid': results['invalid'],
                'accuracy': accuracy,
                'detailed_results': formatted_results
            }
            
            sys.stdout.write(json.dumps(output))
            sys.stdout.flush()
            
        except Exception as e:
            error_result = {
                'error': str(e),
                'status': 'failed'
            }
            sys.stderr.write(f"Hata oluştu: {str(e)}\n")
            sys.stdout.write(json.dumps(error_result))
            sys.stdout.flush()

    def detect_circles_and_marks(self, image: np.ndarray, answer_key: List[str]) -> Tuple[np.ndarray, List[Dict]]:
        output = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(blurred)
        _, binary = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        circles = cv2.HoughCircles(
            enhanced,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=10,
            maxRadius=50
        )

        detected_circles = []

        if circles is not None:
            circles = np.uint16(np.around(circles))
            for c in circles[0, :]:
                x, y, r = int(c[0]), int(c[1]), int(c[2])
                
                mask = self.create_circle_mask(gray, x, y, r-2)
                roi = cv2.bitwise_and(binary, binary, mask=mask)
                total_pixels = cv2.countNonZero(mask)
                filled_pixels = cv2.countNonZero(roi)
                fill_ratio = filled_pixels / total_pixels if total_pixels > 0 else 0
                
                is_filled = fill_ratio > 0.3  
                
                color = (0, 255, 0) if is_filled else (0, 0, 255)
                cv2.circle(output, (x, y), r, color, 2)
                cv2.circle(output, (x, y), 2, color, 3)
                
                sys.stderr.write(f"Daire: x={x}, y={y}, fill_ratio={fill_ratio:.2f}, is_filled={is_filled}\n")
                
                detected_circles.append({
                    'x': x,
                    'y': y,
                    'radius': r,
                    'is_filled': is_filled,
                    'fill_ratio': fill_ratio
                })

        return output, detected_circles

    def create_circle_mask(self, image: np.ndarray, x: int, y: int, r: int) -> np.ndarray:
        h, w = image.shape[:2]
        mask = np.zeros((h, w), dtype=np.uint8)
        cv2.circle(mask, (x, y), r, 255, -1)
        return mask

    def group_circles(self, circles: List[Dict]) -> List[List[Dict]]:
        if not circles:
            return []

        circles = sorted(circles, key=lambda x: x['y'])
        groups = []
        current_group = [circles[0]]

        for circle in circles[1:]:
            if abs(circle['y'] - current_group[0]['y']) <= self.y_threshold:
                current_group.append(circle)
            else:
                current_group = sorted(current_group, key=lambda x: x['x'])
                groups.append(current_group)
                current_group = [circle]

        if current_group:
            current_group = sorted(current_group, key=lambda x: x['x'])
            groups.append(current_group)

        return groups

    def analyze_groups(self, groups: List[List[Dict]], answer_key: List[str]) -> Tuple[Dict[str, int], List[Tuple]]:
        results = {
            'correct': 0,
            'incorrect': 0,
            'empty': 0,
            'invalid': 0
        }
        answer_status = []

        sys.stderr.write(f"\nToplam beklenen soru sayısı: {len(answer_key)}\n")
        sys.stderr.write(f"Tespit edilen grup sayısı: {len(groups)}\n")

        for i in range(len(answer_key)):
            if i >= len(groups):
                results['invalid'] += 1
                answer_status.append((i + 1, 'Invalid', None, answer_key[i]))
                sys.stderr.write(f"Soru {i + 1}: Grup bulunamadı - Geçersiz olarak işaretlendi\n")
                continue

            group = groups[i]
            marked_circles = sum(1 for circle in group if circle['is_filled'])

            sys.stderr.write(f"Soru {i + 1}: İşaretli daire sayısı = {marked_circles}\n")

            if marked_circles == 0:
                results['empty'] += 1
                answer_status.append((i + 1, 'Empty', None, answer_key[i]))
                sys.stderr.write(f"Soru {i + 1}: Boş\n")
            elif marked_circles > 1:
                results['invalid'] += 1
                answer_status.append((i + 1, 'Invalid', None, answer_key[i]))
                sys.stderr.write(f"Soru {i + 1}: Birden fazla işaretleme - Geçersiz\n")
            else:
                marked_index = next(i for i, circle in enumerate(group) if circle['is_filled'])
                marked_answer = string.ascii_lowercase[marked_index]
                correct_answer = answer_key[i]

                if marked_answer == correct_answer:
                    results['correct'] += 1
                    answer_status.append((i + 1, 'Correct', marked_answer, correct_answer))
                    sys.stderr.write(f"Soru {i + 1}: Doğru (İşaretlenen: {marked_answer})\n")
                else:
                    results['incorrect'] += 1
                    answer_status.append((i + 1, 'Incorrect', marked_answer, correct_answer))
                    sys.stderr.write(f"Soru {i + 1}: Yanlış (İşaretlenen: {marked_answer}, Doğru: {correct_answer})\n")

        return results, answer_status

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.stderr.write("Hata: 2 argüman gerekli (görüntü yolu ve cevap anahtarı)\n")
        sys.exit(1)
        
    image_path = sys.argv[1]
    try:
        answer_key = json.loads(sys.argv[2])
    except json.JSONDecodeError:
        sys.stderr.write("Hata: Cevap anahtarı geçerli JSON formatında değil\n")
        sys.exit(1)
        
    processor = FormProcessor()
    processor.process_image(image_path, answer_key) 