import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkDuplicatesWithSentenceTransformers } from '@/lib/ai-bridge';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, district, threshold } = body;

    if (!title && !description) {
      return NextResponse.json({ error: 'Title or description is required for deduplication check' }, { status: 400 });
    }

    // Fetch existing challenges from database
    const existingChallenges = await prisma.challenge.findMany({
      take: 50,
      select: {
        id: true,
        title: true,
        description: true,
        district: true,
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = await checkDuplicatesWithSentenceTransformers(
      title || '',
      description || '',
      existingChallenges,
      threshold || 0.65
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Deduplicate API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to check deduplication' }, { status: 500 });
  }
}
