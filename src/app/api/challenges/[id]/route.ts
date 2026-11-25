import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const currentUser = getUserFromRequest(req);

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
            district: true,
            institution: true,
            company: true,
            avatar: true,
          },
        },
        solutions: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                userType: true,
                district: true,
                institution: true,
                company: true,
                avatar: true,
              },
            },
          },
        },
        comments: {
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
        },
        _count: {
          select: {
            supports: true,
          },
        },
        supports: currentUser ? { where: { userId: currentUser.id } } : false,
        savedChallenges: currentUser ? { where: { userId: currentUser.id } } : false,
      },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const formattedSolutions = challenge.solutions.map((s) => ({
      ...s,
      skillsRequired: JSON.parse(s.skillsRequired || '[]'),
      teamMembers: JSON.parse(s.teamMembers || '[]'),
    }));

    return NextResponse.json({
      challenge: {
        ...challenge,
        images: JSON.parse(challenge.images || '[]'),
        tags: JSON.parse(challenge.tags || '[]'),
        supportCount: challenge._count.supports,
        solutionCount: challenge.solutions.length,
        isSupported: currentUser ? challenge.supports.length > 0 : false,
        isSaved: currentUser ? challenge.savedChallenges.length > 0 : false,
        solutions: formattedSolutions,
      },
    });
  } catch (error: any) {
    console.error('Get Challenge Detail Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status, title, description, category, district, urgency } = body;

    const existing = await prisma.challenge.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Only owner or admin can edit
    if (existing.userId !== userPayload.id && userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. You cannot update this challenge.' }, { status: 403 });
    }

    const updated = await prisma.challenge.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(district && { district }),
        ...(urgency && { urgency }),
      },
    });

    // Notify challenge owner if status changed by admin
    if (status && status !== existing.status && existing.userId !== userPayload.id) {
      await prisma.notification.create({
        data: {
          userId: existing.userId,
          title: 'Challenge Status Updated',
          message: `Your challenge "${existing.title.substring(0, 30)}..." status has been updated to "${status}".`,
          type: 'status',
          link: `/challenges/${id}`,
        },
      });
    }

    return NextResponse.json({ success: true, challenge: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const existing = await prisma.challenge.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    if (existing.userId !== userPayload.id && userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.challenge.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
