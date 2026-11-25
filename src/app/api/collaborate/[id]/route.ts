import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json(); // Accepted or Rejected

    if (!status || (status !== 'Accepted' && status !== 'Rejected')) {
      return NextResponse.json({ error: 'Status must be Accepted or Rejected' }, { status: 400 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    });

    if (!collab) {
      return NextResponse.json({ error: 'Collaboration request not found' }, { status: 404 });
    }

    if (collab.receiverId !== userPayload.id && userPayload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: { status },
    });

    if (status === 'Accepted') {
      // Award impact score points to both users (+15)
      await prisma.user.update({
        where: { id: collab.senderId },
        data: { impactScore: { increment: 15 } },
      });
      await prisma.user.update({
        where: { id: collab.receiverId },
        data: { impactScore: { increment: 15 } },
      });
    }

    // Notify sender
    await prisma.notification.create({
      data: {
        userId: collab.senderId,
        title: `Collaboration ${status}!`,
        message: `${collab.receiver.name} has ${status.toLowerCase()} your collaboration request.`,
        type: 'collab',
        link: '/collaborate',
      },
    });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
