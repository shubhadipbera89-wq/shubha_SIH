import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest'; // latest, most_supported, most_urgent

    const where: any = {};

    if (district && district !== 'All') {
      where.district = district;
    }
    if (category && category !== 'All') {
      where.category = category;
    }
    if (status && status !== 'All') {
      where.status = status;
    }
    if (urgency && urgency !== 'All') {
      where.urgency = urgency;
    }
    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { village: { contains: q } },
        { block: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'most_supported') {
      orderBy = { supports: { _count: 'desc' } };
    } else if (sort === 'most_urgent') {
      orderBy = { urgency: 'desc' };
    }

    const currentUser = getUserFromRequest(req);

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            userType: true,
            district: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            supports: true,
            solutions: true,
            comments: true,
          },
        },
        supports: currentUser ? { where: { userId: currentUser.id } } : false,
        savedChallenges: currentUser ? { where: { userId: currentUser.id } } : false,
      },
    });

    const formatted = challenges.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      district: c.district,
      block: c.block,
      village: c.village,
      location: c.location,
      images: JSON.parse(c.images || '[]'),
      impact: c.impact,
      peopleAffected: c.peopleAffected,
      urgency: c.urgency,
      status: c.status,
      tags: JSON.parse(c.tags || '[]'),
      createdAt: c.createdAt,
      postedBy: c.user,
      supportCount: c._count.supports,
      solutionCount: c._count.solutions,
      commentCount: c._count.comments,
      isSupported: currentUser ? c.supports.length > 0 : false,
      isSaved: currentUser ? c.savedChallenges.length > 0 : false,
    }));

    return NextResponse.json({ challenges: formatted });
  } catch (error: any) {
    console.error('Fetch Challenges Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized. Please login to report a challenge.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      district,
      block,
      village,
      location,
      images,
      impact,
      peopleAffected,
      urgency,
      tags,
    } = body;

    if (!title || !description || !category || !district) {
      return NextResponse.json({ error: 'Title, description, category, and district are required.' }, { status: 400 });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        district,
        block: block || null,
        village: village || null,
        location: location || null,
        images: JSON.stringify(images || []),
        impact: impact || null,
        peopleAffected: Number(peopleAffected) || 0,
        urgency: urgency || 'Medium',
        tags: JSON.stringify(tags || []),
        status: 'Submitted',
        userId: userPayload.id,
      },
    });

    // Increment user impact score (+15 points for reporting useful challenge)
    await prisma.user.update({
      where: { id: userPayload.id },
      data: { impactScore: { increment: 15 } },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: userPayload.id,
        title: 'Challenge Reported!',
        message: `Your challenge "${title.substring(0, 40)}..." has been submitted and is under administrative review. (+15 Impact Points)`,
        type: 'info',
        link: `/challenges/${challenge.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      challenge: {
        ...challenge,
        images: JSON.parse(challenge.images),
        tags: JSON.parse(challenge.tags),
      },
    });
  } catch (error: any) {
    console.error('Create Challenge Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
