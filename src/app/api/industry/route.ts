import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const sector = searchParams.get('sector');

    const where: any = {};
    if (district && district !== 'All') where.district = district;
    if (sector && sector !== 'All') where.sector = sector;

    const industries = await prisma.industry.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const formatted = industries.map((i) => ({
      ...i,
      resourcesOffered: JSON.parse(i.resourcesOffered || '[]'),
      mentorshipAreas: JSON.parse(i.mentorshipAreas || '[]'),
    }));

    return NextResponse.json({ industries: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || (userPayload.userType !== 'Industry Professional' && userPayload.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only Industry Representatives or Admins can register corporate profiles' }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, district, sector, resourcesOffered, mentorshipAreas, description, website, logo } = body;

    const industry = await prisma.industry.create({
      data: {
        name,
        code,
        district,
        sector,
        resourcesOffered: JSON.stringify(resourcesOffered || []),
        mentorshipAreas: JSON.stringify(mentorshipAreas || []),
        description,
        website: website || null,
        logo: logo || null,
      },
    });

    return NextResponse.json({ success: true, industry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
