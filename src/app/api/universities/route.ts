import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');

    const where: any = {};
    if (district && district !== 'All') where.district = district;

    const universities = await prisma.university.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const formatted = universities.map((u) => ({
      ...u,
      departments: JSON.parse(u.departments || '[]'),
      researchAreas: JSON.parse(u.researchAreas || '[]'),
    }));

    return NextResponse.json({ universities: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    if (!userPayload || (userPayload.userType !== 'University Faculty' && userPayload.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Only University Representatives or Admins can create institution profiles' }, { status: 403 });
    }

    const body = await req.json();
    const { name, code, district, location, departments, researchAreas, description, website, logo } = body;

    const university = await prisma.university.create({
      data: {
        name,
        code,
        district,
        location,
        departments: JSON.stringify(departments || []),
        researchAreas: JSON.stringify(researchAreas || []),
        description,
        website: website || null,
        logo: logo || null,
      },
    });

    return NextResponse.json({ success: true, university });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
