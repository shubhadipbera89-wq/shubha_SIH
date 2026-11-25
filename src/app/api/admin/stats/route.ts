import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  try {
    const userPayload = getUserFromRequest(req);
    // Allow public view or restrict to admin
    const isAdmin = userPayload?.role === 'ADMIN';

    const [
      totalUsers,
      totalChallenges,
      totalSolutions,
      resolvedChallenges,
      activeCollaborations,
      districtBreakdownRaw,
      categoryBreakdownRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.challenge.count(),
      prisma.solution.count(),
      prisma.challenge.count({ where: { status: { in: ['Implemented', 'Resolved'] } } }),
      prisma.collaboration.count({ where: { status: 'Accepted' } }),
      prisma.challenge.groupBy({
        by: ['district'],
        _count: { id: true },
      }),
      prisma.challenge.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
    ]);

    const districtBreakdown = districtBreakdownRaw.map((item) => ({
      district: item.district,
      count: item._count.id,
    }));

    const categoryBreakdown = categoryBreakdownRaw.map((item) => ({
      category: item.category,
      count: item._count.id,
    }));

    // Universities count & Industry count
    const [totalUniversities, totalIndustries] = await Promise.all([
      prisma.university.count(),
      prisma.industry.count(),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalChallenges,
        totalSolutions,
        resolvedChallenges,
        activeCollaborations,
        totalUniversities,
        totalIndustries,
        districtBreakdown,
        categoryBreakdown,
      },
    });
  } catch (error: any) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
