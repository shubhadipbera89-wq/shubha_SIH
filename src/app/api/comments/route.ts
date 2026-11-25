import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');

    if (!challengeId) {
      return NextResponse.json({ error: 'challengeId param is required' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { challengeId, flagged: false },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to comment.' }, { status: 401 });
    }

    const { challengeId, content, parentId } = await req.json();

    if (!challengeId || !content || content.trim() === '') {
      return NextResponse.json({ error: 'Challenge ID and comment text are required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        challengeId,
        content: content.trim(),
        parentId: parentId || null,
        userId: userPayload.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true,
            avatar: true,
          },
        },
      },
    });

    // Notify challenge owner
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { userId: true, title: true },
    });

    if (challenge && challenge.userId !== userPayload.id) {
      await prisma.notification.create({
        data: {
          userId: challenge.userId,
          title: 'New Comment on Challenge',
          message: `${userPayload.name} commented on your challenge "${challenge.title.substring(0, 30)}...".`,
          type: 'info',
          link: `/challenges/${challengeId}`,
        },
      });
    }

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commentId, action } = await req.json();
    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    if (action === 'like') {
      const updated = await prisma.comment.update({
        where: { id: commentId },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ success: true, likes: updated.likes });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('id');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const existing = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!existing) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (existing.userId !== userPayload.id && userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({ where: { id: commentId } });

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
