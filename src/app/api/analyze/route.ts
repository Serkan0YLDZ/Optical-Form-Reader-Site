import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imagePath, areaName, areaId, answerKey } = await request.json();
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [
        path.join(process.cwd(), 'python', 'form_processor.py'),
        path.join(process.cwd(), 'public', imagePath),
        JSON.stringify(answerKey)
      ]);

      let resultData = '';

      pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python hatası: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ 
            error: 'Python işlemi başarısız oldu' 
          }, { status: 500 }));
          return;
        }

        try {
          const results = JSON.parse(resultData);
          resolve(NextResponse.json({
            areaName,
            ...results
          }));
        } catch (error) {
          resolve(NextResponse.json({ 
            error: 'Sonuç parse edilemedi', 
            details: error 
          }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}