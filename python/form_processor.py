import cv2
import numpy as np
from typing import List, Tuple, Dict
import string
import json
import sys

class FormProcessor:
    def __init__(self):
        self.y_threshold = 10
        self.filling_threshold = 0.6

    def process_image(self, image_path: str, answer_key: List[str]) -> None:
        try:
            # Debug bilgisi
            sys.stderr.write(f"Debug - İşlem başlıyor\n")
            sys.stderr.write(f"Image path: {image_path}\n")
            sys.stderr.write(f"Answer key: {answer_key}\n")
            
            # Görüntüyü oku
            image = cv2.imread(image_path)
            if image is None:
                raise Exception("Görüntü okunamadı")
            
            # Görüntüyü işle
            processed_image, circles = self.detect_circles_and_marks(image, answer_key)
            if not circles:
                raise Exception("Hiç daire tespit edilemedi")
            
            # Grupla ve analiz et
            groups = self.group_circles(circles)
            results, answer_status = self.analyze_groups(groups, answer_key)
            
            # Debug görüntüsünü kaydet
            debug_image_path = image_path.replace('.png', '_processed.png')
            cv2.imwrite(debug_image_path, processed_image)
            
            # Sonuçları hazırla
            final_results = {
                'summary': {
                    'total_questions': len(answer_key),
                    'correct': results['correct'],
                    'incorrect': results['incorrect'],
                    'empty': results['empty'],
                    'invalid': results['invalid'],
                    'accuracy': results['correct'] / len(answer_key) if len(answer_key) > 0 else 0
                },
                'detailed_results': [
                    {
                        'question': status[0],
                        'marked_answer': status[2],
                        'correct_answer': status[3],
                        'status': status[1].lower()
                    }
                    for status in answer_status
                ],
                'processed_image_path': debug_image_path,
                'status': 'success'
            }
            
            # Sonuçları JSON olarak yazdır
            sys.stdout.write(json.dumps(final_results))
            sys.stdout.flush()
            
        except Exception as e:
            error_result = {
                'error': str(e),
                'status': 'failed'
            }
            sys.stdout.write(json.dumps(error_result))
            sys.stdout.flush()

    def detect_circles_and_marks(self, image: np.ndarray, answer_key: List[str]) -> Tuple[np.ndarray, List[Dict]]:
        output = image.copy()
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Görüntüyü iyileştir
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(blurred)

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
            detected_circles = [
                {
                    'x': int(c[0]),
                    'y': int(c[1]),
                    'radius': int(c[2]),
                    'is_filled': cv2.mean(gray, mask=self.create_circle_mask(gray, int(c[0]), int(c[1]), int(c[2])-2))[0] < 128
                }
                for c in circles[0, :]
            ]

        return output, detected_circles

    def create_circle_mask(self, image: np.ndarray, x: int, y: int, r: int) -> np.ndarray:
        mask = np.zeros(image.shape, dtype=np.uint8)
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

        for i, group in enumerate(groups):
            if i >= len(answer_key):
                break

            marked_circles = sum(1 for circle in group if circle['is_filled'])

            if marked_circles == 0:
                results['empty'] += 1
                answer_status.append((i + 1, 'Empty', None, answer_key[i]))
            elif marked_circles > 1:
                results['invalid'] += 1
                answer_status.append((i + 1, 'Invalid', None, answer_key[i]))
            else:
                marked_index = next(i for i, circle in enumerate(group) if circle['is_filled'])
                marked_answer = string.ascii_lowercase[marked_index]
                correct_answer = answer_key[i]

                if marked_answer == correct_answer:
                    results['correct'] += 1
                    answer_status.append((i + 1, 'Correct', marked_answer, correct_answer))
                else:
                    results['incorrect'] += 1
                    answer_status.append((i + 1, 'Incorrect', marked_answer, correct_answer))

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