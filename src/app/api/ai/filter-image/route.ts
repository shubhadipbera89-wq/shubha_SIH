import { NextRequest, NextResponse } from 'next/server';
import { inspectImageWithOpenCV } from '@/lib/ai-bridge';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image_url, image_base64 } = body;

    if (!image_url && !image_base64) {
      return NextResponse.json({ error: 'image_url or image_base64 is required' }, { status: 400 });
    }

    const result = await inspectImageWithOpenCV(image_url, image_base64);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('OpenCV Filter API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to inspect image with OpenCV' }, { status: 500 });
  }
}
