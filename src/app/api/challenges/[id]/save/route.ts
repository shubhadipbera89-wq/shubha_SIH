import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to save.' }, { status: 401 });
    }

    const challengeId = params.id;
    const userId = userPayload.id;

    const existing = await prisma.savedChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    let isSaved = false;

    if (existing) {
      await prisma.savedChallenge.delete({
        where: { id: existing.id },
      });
      isSaved = false;
    } else {
      await prisma.savedChallenge.create({
        data: {
          userId,
          challengeId,
        },
      });
      isSaved = true;
    }

    return NextResponse.json({ success: true, isSaved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
