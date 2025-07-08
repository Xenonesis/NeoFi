import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    const fullPath = join(process.cwd(), 'public', filePath);
    
    // Only serve specific allowed files
    const allowedFiles = ['1.png', 'logo.svg', 'favicon.ico', 'favicon.svg', 'apple-icon.png'];
    const fileName = filePath.split('/').pop();
    
    if (!fileName || !allowedFiles.includes(fileName)) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    const fileBuffer = readFileSync(fullPath);
    
    // Set appropriate content type
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (fileName.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    } else if (fileName.endsWith('.ico')) {
      contentType = 'image/x-icon';
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Not Found', { status: 404 });
  }
}