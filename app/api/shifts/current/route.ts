import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the current active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: user.userId,
        status: 'IN_PROGRESS',
      },
      orderBy: {
        actualStart: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      shift: activeShift,
    });
  } catch (error) {
    console.error('Get current shift error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
