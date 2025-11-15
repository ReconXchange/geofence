import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

const clockOutSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { latitude, longitude, accuracy } = clockOutSchema.parse(body);

    // Find the active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: user.userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!activeShift) {
      return NextResponse.json(
        { error: 'No active shift found' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Update shift to completed
    const shift = await prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        actualEnd: now,
        status: 'COMPLETED',
      },
    });

    // Create final location ping
    await prisma.locationPing.create({
      data: {
        shiftId: shift.id,
        latitude,
        longitude,
        accuracy,
        timestamp: now,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'CLOCK_OUT',
        entityType: 'SHIFT',
        entityId: shift.id,
        metadata: { latitude, longitude },
      },
    });

    return NextResponse.json({
      success: true,
      shift,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Clock out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
