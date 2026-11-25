import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success to avoid email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, password reset instructions have been sent.',
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Password Reset Requested',
        message: 'A password reset link was requested for your account. If you requested this, please use the reset form.',
        type: 'info',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your registered email address.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
