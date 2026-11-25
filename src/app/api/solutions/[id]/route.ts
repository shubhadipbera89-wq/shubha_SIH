import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const solution = await prisma.solution.findUnique({
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
        challenge: {
          select: {
            id: true,
            title: true,
            category: true,
            district: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    return NextResponse.json({
      solution: {
        ...solution,
        skillsRequired: JSON.parse(solution.skillsRequired || '[]'),
        teamMembers: JSON.parse(solution.teamMembers || '[]'),
      },
    });
  } catch (error: any) {
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
    const {
      status,
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

    const existing = await prisma.solution.findUnique({
      where: { id },
      include: {
        challenge: { select: { id: true, userId: true, title: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    const isAuthor = existing.userId === userPayload.id;
    const isChallengeOwner = existing.challenge.userId === userPayload.id;
    const isAdmin = userPayload.role === 'ADMIN';

    if (!isAuthor && !isChallengeOwner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = {};

    // Author can update details if not yet implemented
    if (isAuthor || isAdmin) {
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (approach) updateData.approach = approach;
      if (resources !== undefined) updateData.resources = resources;
      if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost;
      if (estimatedTimeline !== undefined) updateData.estimatedTimeline = estimatedTimeline;
      if (expectedImpact !== undefined) updateData.expectedImpact = expectedImpact;
      if (skillsRequired) updateData.skillsRequired = JSON.stringify(skillsRequired);
      if (teamMembers) updateData.teamMembers = JSON.stringify(teamMembers);
    }

    // Challenge owner or Admin can update status
    if (status && (isChallengeOwner || isAdmin)) {
      updateData.status = status;

      // Status-based impact reward
      let scoreReward = 0;
      if (status === 'Shortlisted' && existing.status !== 'Shortlisted') scoreReward = 20;
      if (status === 'Pilot' && existing.status !== 'Pilot') scoreReward = 50;
      if (status === 'Implemented' && existing.status !== 'Implemented') scoreReward = 100;

      if (scoreReward > 0) {
        await prisma.user.update({
          where: { id: existing.userId },
          data: { impactScore: { increment: scoreReward } },
        });
      }

      // Notify solution author
      await prisma.notification.create({
        data: {
          userId: existing.userId,
          title: `Solution ${status}!`,
          message: `Your solution "${existing.title.substring(0, 30)}..." for challenge "${existing.challenge.title.substring(0, 30)}..." has been marked as "${status}".`,
          type: 'solution',
          link: `/challenges/${existing.challenge.id}`,
        },
      });
    }

    const updated = await prisma.solution.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      solution: {
        ...updated,
        skillsRequired: JSON.parse(updated.skillsRequired || '[]'),
        teamMembers: JSON.parse(updated.teamMembers || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Update Solution Error:', error);
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
    const existing = await prisma.solution.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    if (existing.userId !== userPayload.id && userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.solution.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Solution deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
