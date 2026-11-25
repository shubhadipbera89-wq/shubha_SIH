import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const userType = searchParams.get('userType');
    const skill = searchParams.get('skill');
    const search = searchParams.get('search');

    const currentUser = getUserFromRequest(req);

    // If request has type=my_requests, return incoming/outgoing collabs
    const type = searchParams.get('type');
    if (type === 'my_requests' && currentUser) {
      const sent = await prisma.collaboration.findMany({
        where: { senderId: currentUser.id },
        include: {
          receiver: {
            select: { id: true, name: true, userType: true, district: true, avatar: true, institution: true, company: true },
          },
          challenge: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      const received = await prisma.collaboration.findMany({
        where: { receiverId: currentUser.id },
        include: {
          sender: {
            select: { id: true, name: true, userType: true, district: true, avatar: true, institution: true, company: true },
          },
          challenge: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ sent, received });
    }

    // Default: Return searchable potential collaborators list
    const where: any = {};
    if (currentUser) {
      where.id = { not: currentUser.id }; // exclude self
    }
    if (district && district !== 'All') where.district = district;
    if (userType && userType !== 'All') where.userType = userType;
    if (skill && skill.trim() !== '') {
      where.skills = { contains: skill.trim() };
    }
    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { bio: { contains: q } },
        { institution: { contains: q } },
        { company: { contains: q } },
        { skills: { contains: q } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { impactScore: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        district: true,
        bio: true,
        city: true,
        institution: true,
        company: true,
        skills: true,
        interests: true,
        impactScore: true,
        avatar: true,
        createdAt: true,
      },
    });

    const formatted = users.map((u) => ({
      ...u,
      skills: JSON.parse(u.skills || '[]'),
      interests: JSON.parse(u.interests || '[]'),
    }));

    return NextResponse.json({ users: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to send collaboration requests.' }, { status: 401 });
    }

    const { receiverId, challengeId, message, roleNeeded } = await req.json();

    if (!receiverId || !message) {
      return NextResponse.json({ error: 'Receiver ID and invitation message are required' }, { status: 400 });
    }

    if (receiverId === userPayload.id) {
      return NextResponse.json({ error: 'You cannot send a collaboration request to yourself' }, { status: 400 });
    }

    const collab = await prisma.collaboration.create({
      data: {
        senderId: userPayload.id,
        receiverId,
        challengeId: challengeId || null,
        message,
        roleNeeded: roleNeeded || null,
        status: 'Pending',
      },
    });

    // Notify receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: 'New Collaboration Request',
        message: `${userPayload.name} sent you a collaboration request: "${message.substring(0, 40)}..."`,
        type: 'collab',
        link: '/collaborate',
      },
    });

    return NextResponse.json({ success: true, collaboration: collab });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
