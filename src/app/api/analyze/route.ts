import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://python-app:5000';

    const response = await fetch(`${pythonServiceUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_path: data.imagePath,
        answer_key: data.answerKey,
        area_name: data.areaName,
        image_id: data.imageId
      }),
    });

    if (!response.ok) {
      throw new Error(`Python servisi hatası: ${response.statusText}`);
    }

    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Analiz hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Analiz sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// GET isteğini de ekleyelim
export async function GET() {
  return NextResponse.json({ error: 'Bu endpoint sadece POST isteklerini kabul eder' }, { status: 405 });
}