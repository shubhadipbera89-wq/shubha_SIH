import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');

    const currentUser = getUserFromRequest(req);
    const targetUserId = userIdParam || (currentUser ? currentUser.id : null);

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        challenges: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { supports: true, solutions: true } },
          },
        },
        solutions: {
          orderBy: { createdAt: 'desc' },
          include: {
            challenge: { select: { id: true, title: true, category: true, district: true } },
          },
        },
        supports: {
          include: {
            challenge: {
              select: { id: true, title: true, category: true, district: true, urgency: true, status: true },
            },
          },
        },
        achievements: {
          orderBy: { earnedAt: 'desc' },
        },
        sentCollabs: {
          where: { status: 'Accepted' },
          include: { receiver: { select: { id: true, name: true, userType: true, avatar: true } } },
        },
        receivedCollabs: {
          where: { status: 'Accepted' },
          include: { sender: { select: { id: true, name: true, userType: true, avatar: true } } },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const formattedChallenges = user.challenges.map((c) => ({
      ...c,
      images: JSON.parse(c.images || '[]'),
      tags: JSON.parse(c.tags || '[]'),
      supportCount: c._count.supports,
      solutionCount: c._count.solutions,
    }));

    const formattedSolutions = user.solutions.map((s) => ({
      ...s,
      skillsRequired: JSON.parse(s.skillsRequired || '[]'),
      teamMembers: JSON.parse(s.teamMembers || '[]'),
    }));

    const activeCollabs = [...user.sentCollabs, ...user.receivedCollabs];

    return NextResponse.json({
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        state: user.state,
        district: user.district,
        userType: user.userType,
        role: user.role,
        bio: user.bio,
        city: user.city,
        institution: user.institution,
        company: user.company,
        website: user.website,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]'),
        impactScore: user.impactScore,
        avatar: user.avatar,
        createdAt: user.createdAt,
        reportedChallenges: formattedChallenges,
        submittedSolutions: formattedSolutions,
        supportedChallenges: user.supports.map((sup) => sup.challenge),
        collaborations: activeCollabs,
        achievements: user.achievements,
      },
    });
  } catch (error: any) {
    console.error('Fetch Profile Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, mobile, district, city, bio, institution, company, website, avatar, skills, interests } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userPayload.id },
      data: {
        ...(name && { name }),
        ...(mobile !== undefined && { mobile }),
        ...(district && { district }),
        ...(city !== undefined && { city }),
        ...(bio !== undefined && { bio }),
        ...(institution !== undefined && { institution }),
        ...(company !== undefined && { company }),
        ...(website !== undefined && { website }),
        ...(avatar !== undefined && { avatar }),
        ...(skills && { skills: JSON.stringify(skills) }),
        ...(interests && { interests: JSON.stringify(interests) }),
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        ...updatedUser,
        skills: JSON.parse(updatedUser.skills || '[]'),
        interests: JSON.parse(updatedUser.interests || '[]'),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
