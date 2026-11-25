import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, mobile, state, district, userType, institution, company, city } = body;

    if (!name || !email || !password || !district || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        mobile: mobile || null,
        state: state || 'Jharkhand',
        district,
        userType,
        institution: institution || null,
        company: company || null,
        city: city || null,
        impactScore: 10, // Sign-up bonus points
        role: email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to JanSamadhan!',
        message: `Greetings ${user.name}! Your account as a ${user.userType} in ${user.district} is now active. Start reporting or solving challenges for Jharkhand.`,
        type: 'info',
        link: '/dashboard',
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      role: user.role,
      district: user.district,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        district: user.district,
        userType: user.userType,
        role: user.role,
        impactScore: user.impactScore,
      },
      token,
    });

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
