import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to support.' }, { status: 401 });
    }

    const challengeId = params.id;
    const userId = userPayload.id;

    const existing = await prisma.support.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    let isSupported = false;

    if (existing) {
      // Remove support
      await prisma.support.delete({
        where: { id: existing.id },
      });
      isSupported = false;
    } else {
      // Add support
      await prisma.support.create({
        data: {
          userId,
          challengeId,
        },
      });
      isSupported = true;

      // Increment supporter impact score (+2 points)
      await prisma.user.update({
        where: { id: userId },
        data: { impactScore: { increment: 2 } },
      });

      // Fetch challenge to notify owner
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
        select: { userId: true, title: true },
      });

      if (challenge && challenge.userId !== userId) {
        await prisma.notification.create({
          data: {
            userId: challenge.userId,
            title: 'New Challenge Support!',
            message: `${userPayload.name} supported your challenge "${challenge.title.substring(0, 35)}...".`,
            type: 'support',
            link: `/challenges/${challengeId}`,
          },
        });
      }
    }

    const count = await prisma.support.count({ where: { challengeId } });

    return NextResponse.json({ success: true, isSupported, supportCount: count });
  } catch (error: any) {
    console.error('Support Toggle Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
