import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioWithWhisper } from '@/lib/ai-bridge';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audio_base64, language } = body;

    if (!audio_base64 && !body.sample) {
      return NextResponse.json({ error: 'Audio data is required' }, { status: 400 });
    }

    const result = await transcribeAudioWithWhisper(audio_base64 || 'data:audio/wav;base64,mock', language || 'hi');
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Whisper API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process audio' }, { status: 500 });
  }
}
