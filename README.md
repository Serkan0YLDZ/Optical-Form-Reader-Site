# Optical Form Reader

This project is a web application that evaluates the selected fields in the uploaded optical form according to the answer key. It was developed using Next.js and Python Flask.

<p align="center">

<img src="https://github.com/user-attachments/assets/5f3ba00b-a442-4610-9d52-2c892ec09aa0" alt="gif" />
</p>

## 🚀 Features

- 📝 Loading and processing optical form images
- 🖼️ Image zoom and pan features
- ☁️ Image storage with Cloudinary integration
- ✂️ Interactive selection and cropping of form fields
- 🎯 Automatic evaluation of questions according to answer key
- 📊 Detailed reporting of results
- 🌓 Dark/Light theme support

## 🛠️ Technologies

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

### Framework
- Docker

## 📋 Requirements

- Cloudinary account

## 🔧 Installation

1. Clone the repo:
```bash
git clone https://github.com/Serkan0YLDZ/Optical-Form-Reader-Site.git/
cd optical-form-reader
```

2.1 Set environment variables (for Docker):
```bash
# Create .env.local file
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PYTHON_SERVICE_URL=http://python-app:5000
```

2.2 Set environment variables (for Developer mode):
```bash
# Create .env.local file
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PYTHON_SERVICE_URL=http://localhost:5000
```

3. Install required packages:
```bash
npm install --legacy-peer-deps
npm install @radix-ui/react-primitive -f
npm install cloudinary -f
```

4.1 Run with Docker:
```bash
docker-compose up --build
```

4.2 Or run manually:

For Frontend:
```bash
npm run dev
```

For Backend:
```bash
pip install -r requirements.txt
cd python
python3 app.py
```

## 💻 Usage

1. On the main page, click the "Select File" button to upload the form image
2. On the edit page, select the form fields
3. Specify the answer key for each field
4. Finally, you can view the results on the /result page by clicking the "Evaluate" button

## 🖱️ Shortcuts
- Shift: Switch between scrolling and selecting modes
- Ctrl + S: Save the selected area
- Ctrl + Z: Last saved area delete

## 🌐 API Endpoints

### Frontend API Routes

- `POST /api/upload`: Upload image
- `POST /api/crop`: Crop selected area
- `POST /api/analyze`: Evaluate form

### Python API Endpoints

- `POST /analyze`: Analyze form image
