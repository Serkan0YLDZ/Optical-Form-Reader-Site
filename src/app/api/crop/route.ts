import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { cropX, cropY, cropWidth, cropHeight, originalImageName, areaName } = await request.json();
    
    // Koordinatları doğrula ve düzelt
    const validCropX = Math.max(0, Math.round(cropX));
    const validCropY = Math.max(0, Math.round(cropY));
    const validCropWidth = Math.max(1, Math.round(cropWidth));
    const validCropHeight = Math.max(1, Math.round(cropHeight));
    
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
        left: validCropX,
        top: validCropY,
        width: validCropWidth,
        height: validCropHeight
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