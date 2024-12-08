import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Görseli yeniden boyutlandır
    const resizedImageBuffer = await sharp(buffer)
      .resize(2220, 3070, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Public klasörüne kaydet
    const publicPath = path.join(process.cwd(), 'public');
    await writeFile(path.join(publicPath, 'Image1.png'), resizedImageBuffer);

    // Base64 formatına çevir
    const base64Image = `data:image/png;base64,${resizedImageBuffer.toString('base64')}`;

    return NextResponse.json({ success: true, image: base64Image });
  } catch (error) {
    console.error('Yükleme hatası:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
} 