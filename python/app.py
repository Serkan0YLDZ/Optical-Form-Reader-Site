from flask import Flask, request, jsonify
from flask_cors import CORS
from form_processor import FormProcessor
import logging
import requests
from io import BytesIO
import cv2
import numpy as np

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
processor = FormProcessor()

def download_image_from_cloudinary(url):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Görüntü indirilemedi: HTTP {response.status_code}")

        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        
        if image is None:
            raise Exception("Görüntü decode edilemedi")

        return image

    except Exception as e:
        logger.error(f"Görüntü indirme hatası: {str(e)}")
        raise

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        logger.info("Analiz isteği alındı")
        data = request.json
        logger.debug(f"Alınan veri: {data}")

        if not data or 'image_path' not in data or 'answer_key' not in data:
            logger.error("Geçersiz istek formatı")
            return jsonify({'error': 'Geçersiz istek formatı'}), 400

        image_url = data['image_path']
        answer_key = data['answer_key']
        area_name = data.get('area_name', 'Adsız Alan')
        image_id = data.get('image_id', '')

        logger.info(f"İşlenecek görsel URL: {image_url}")
        logger.info(f"Cevap anahtarı: {answer_key}")

        image = download_image_from_cloudinary(image_url)
        
        processed_image, circles = processor.detect_circles_and_marks(image, answer_key)
        if not circles:
            raise Exception("Hiç daire bulunamadı")

        groups = processor.group_circles(circles)
        results, detailed_results = processor.analyze_groups(groups, answer_key)
        
        total_questions = len(answer_key)
        accuracy = (results['correct'] / total_questions) if total_questions > 0 else 0
        
        formatted_results = []
        for question_num, status, marked, correct in detailed_results:
            formatted_results.append({
                'question': question_num,
                'status': status.lower(),
                'marked_answer': marked,
                'correct_answer': correct
            })

        response_data = {
            'success': True,
            'areaName': area_name,
            'image_id': image_id,
            'processed_image_path': image_url,
            'summary': {
                'total_questions': total_questions,
                'correct': results['correct'],
                'incorrect': results['incorrect'],
                'empty': results['empty'],
                'invalid': results['invalid'],
                'accuracy': accuracy
            },
            'questions': formatted_results,
            'detailed_results': formatted_results
        }

        logger.info("Analiz tamamlandı")
        logger.debug(f"Sonuç: {response_data}")

        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Hata oluştu: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 