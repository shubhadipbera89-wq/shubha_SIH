import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const challengeId = searchParams.get('challengeId');
    const status = searchParams.get('status');

    const where: any = {};
    if (challengeId) where.challengeId = challengeId;
    if (status && status !== 'All') where.status = status;

    const solutions = await prisma.solution.findMany({
      where,
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
        challenge: {
          select: {
            id: true,
            title: true,
            category: true,
            district: true,
          },
        },
      },
    });

    const formatted = solutions.map((s) => ({
      ...s,
      skillsRequired: JSON.parse(s.skillsRequired || '[]'),
      teamMembers: JSON.parse(s.teamMembers || '[]'),
    }));

    return NextResponse.json({ solutions: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to submit a solution.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      challengeId,
      title,
      description,
      approach,
      resources,
      estimatedCost,
      estimatedTimeline,
      expectedImpact,
      skillsRequired,
      teamMembers,
    } = body;

    if (!challengeId || !title || !description || !approach) {
      return NextResponse.json({ error: 'Challenge ID, title, description, and approach are required.' }, { status: 400 });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: { id: true, title: true, userId: true },
    });

    if (!challenge) {
      return NextResponse.json({ error: 'Target challenge not found.' }, { status: 404 });
    }

    const solution = await prisma.solution.create({
      data: {
        challengeId,
        title,
        description,
        approach,
        resources: resources || null,
        estimatedCost: estimatedCost || null,
        estimatedTimeline: estimatedTimeline || null,
        expectedImpact: expectedImpact || null,
        skillsRequired: JSON.stringify(skillsRequired || []),
        teamMembers: JSON.stringify(teamMembers || []),
        status: 'Submitted',
        userId: userPayload.id,
      },
    });

    // Increment solution provider impact score (+30 points)
    await prisma.user.update({
      where: { id: userPayload.id },
      data: { impactScore: { increment: 30 } },
    });

    // Notify challenge owner
    if (challenge.userId !== userPayload.id) {
      await prisma.notification.create({
        data: {
          userId: challenge.userId,
          title: 'New Solution Submitted!',
          message: `${userPayload.name} submitted a proposed solution "${title.substring(0, 35)}..." for your challenge.`,
          type: 'solution',
          link: `/challenges/${challengeId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      solution: {
        ...solution,
        skillsRequired: JSON.parse(solution.skillsRequired),
        teamMembers: JSON.parse(solution.teamMembers),
      },
    });
  } catch (error: any) {
    console.error('Submit Solution Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
