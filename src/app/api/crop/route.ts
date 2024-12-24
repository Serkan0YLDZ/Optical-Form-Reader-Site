import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const { cropX, cropY, cropWidth, cropHeight, originalImageName, areaName } = await request.json();
    
    const validCropX = Math.max(0, Math.round(cropX));
    const validCropY = Math.max(0, Math.round(cropY));
    const validCropWidth = Math.max(1, Math.round(cropWidth));
    const validCropHeight = Math.max(1, Math.round(cropHeight));
    
    const result = await cloudinary.uploader.upload(originalImageName, {
      folder: 'areas',
      type: 'upload',
      resource_type: 'image',
      transformation: [{
        crop: 'crop',
        x: validCropX,
        y: validCropY,
        width: validCropWidth,
        height: validCropHeight
      }]
    });

    return NextResponse.json({ 
      success: true, 
      croppedImagePath: result.secure_url,
      cloudinaryId: result.public_id,
      areaName: areaName
    });

  } catch (error) {
    console.error('Kırpma hatası detayı:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kırpma işlemi sırasında bir hata oluştu' 
    }, { 
      status: 500 
    });
  }
} 