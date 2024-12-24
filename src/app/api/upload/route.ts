import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'optical_form',
          resource_type: 'image',
          transformation: [
            { width: 2220, height: 3070, crop: 'fill' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const result = uploadResponse as { public_id: string, secure_url: string };

    return NextResponse.json({ 
      success: true, 
      imageId: result.public_id,
      imageUrl: result.secure_url
    });

  } catch (error) {
    console.error('Yükleme hatası:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
} 