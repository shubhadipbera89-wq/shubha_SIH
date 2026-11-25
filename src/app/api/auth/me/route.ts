import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);

    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        state: true,
        district: true,
        userType: true,
        role: true,
        bio: true,
        city: true,
        institution: true,
        company: true,
        website: true,
        skills: true,
        interests: true,
        impactScore: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get unread notification count
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, read: false },
    });

    return NextResponse.json({
      user: {
        ...user,
        skills: JSON.parse(user.skills || '[]'),
        interests: JSON.parse(user.interests || '[]'),
        unreadNotifications,
      },
    });
  } catch (error: any) {
    console.error('Auth Me Error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
