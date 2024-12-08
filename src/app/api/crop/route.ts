import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { cropX, cropY, cropWidth, cropHeight, originalImageName, areaName } = await request.json();
    
    // Orijinal görselin yolunu al
    const publicPath = path.join(process.cwd(), 'public');
    const areasPath = path.join(publicPath, 'areas');
    const originalImagePath = path.join(publicPath, originalImageName);
    
    // areas klasörünü kontrol et ve yoksa oluştur
    if (!fs.existsSync(areasPath)) {
      await mkdir(areasPath, { recursive: true });
    }
    
    // Görseli kırp
    const croppedImageBuffer = await sharp(originalImagePath)
      .extract({
        left: Math.round(cropX),
        top: Math.round(cropY),
        width: Math.round(cropWidth),
        height: Math.round(cropHeight)
      })
      .toBuffer();

    // Alan adını dosya adı için güvenli hale getir
    const safeAreaName = areaName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().getTime();
    const outputFileName = `${safeAreaName}_${timestamp}.png`;
    await writeFile(path.join(areasPath, outputFileName), croppedImageBuffer);

    return NextResponse.json({ 
      success: true, 
      croppedImagePath: `/areas/${outputFileName}`,
      areaName: areaName
    });
  } catch (error) {
    console.error('Kırpma hatası:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 