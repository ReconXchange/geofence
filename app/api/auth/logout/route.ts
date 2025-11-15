import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { user } = await authenticateRequest(request);

    // Log the logout action if user was authenticated
    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.userId,
          action: 'USER_LOGOUT',
          entityType: 'USER',
          entityId: user.userId,
        },
      });
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
