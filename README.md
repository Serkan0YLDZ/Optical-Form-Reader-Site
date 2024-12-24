# Optik Form Okuyucu 

Bu proje, yüklenen optik formda seçilen alanlarda cevap anahtarına göre değerlendiren bir web uygulamasıdır. Next.js ve Python Flask kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- 📝 Optik form görüntülerini yükleme ve işleme
- 🖼️ Görüntü yakınlaştırma ve kaydırma özellikleri
- ☁️ Cloudinary entegrasyonu ile görüntü depolama
- ✂️ Form alanlarını interaktif olarak seçme ve kırpma
- 🎯 Soruların cevap anahtarına göre otomatik değerlendirme
- 📊 Sonuçları detaylı raporlama
- 🌓 Koyu/Açık tema desteği

## 🛠️ Teknolojiler

### Frontend
- Next.js 
- TypeScript
- Radix UI
- React Zoom Pan Pinch

### Backend
- Python 3.10
- Flask
- OpenCV
- NumPy

### Altyapı
- Docker
- Docker Compose

## 📋 Gereksinimler

- Node.js 18+
- Python 3.10+
- Docker ve Docker Compose
- Cloudinary hesabı

## 🔧 Kurulum

1. Repoyu klonlayın:
```bash
git clone https://github.com/Serkan0YLDZ/Optical-Form-Reader-Site.git/
cd optical-form-reader
```

2.1 Çevre değişkenlerini ayarlayın (Docker için):
```bash
# .env.local dosyası oluşturun 
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PYTHON_SERVICE_URL=http://python-app:5000
```

2.2 Çevre değişkenlerini ayarlayın (Developer mod için):
```bash
# .env.local dosyası oluşturun 
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PYTHON_SERVICE_URL=http://localhost:5000
```

3. Gerekli paketleri yükleyin:
```bash
npm install --legacy-peer-deps
npm install @radix-ui/react-primitive -f
npm install cloudinary -f
```

4.1 Docker ile çalıştırın:
```bash
docker-compose up --build
```

4.2 Veya manuel olarak çalıştırın:

Frontend için:
```bash
npm run dev
```

Backend için:
```bash
pip install -r requirements.txt
cd python
python3 app.py
```

## 💻 Kullanım

1. Ana sayfada "Dosya Seç" butonuna tıklayarak form görselini yükleyin
2. Düzenleme sayfasında form alanlarını seçin
3. Her alan için cevap anahtarını belirleyin
4. Son olarak "Değerlendir" butonuna tıklayarak sonuçları /result sayfasında görüntüleyebilirsiniz

## 🌐 API Endpoints

### Frontend API Routes

- `POST /api/upload`: Görüntü yükleme
- `POST /api/crop`: Seçili alanı kırpma
- `POST /api/analyze`: Form değerlendirme

### Python API Endpoints

- `POST /analyze`: Form görüntüsü analizi