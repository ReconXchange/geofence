import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

const clockInSchema = z.object({
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
    const { latitude, longitude, accuracy } = clockInSchema.parse(body);

    // Check if there's already an active shift
    const existingShift = await prisma.shift.findFirst({
      where: {
        userId: user.userId,
        status: 'IN_PROGRESS',
      },
    });

    if (existingShift) {
      return NextResponse.json(
        { error: 'You are already clocked in' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Check if there's a scheduled shift for today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const scheduledShift = await prisma.shift.findFirst({
      where: {
        userId: user.userId,
        status: 'SCHEDULED',
        scheduledStart: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    let shift;

    if (scheduledShift) {
      // Update the scheduled shift
      shift = await prisma.shift.update({
        where: { id: scheduledShift.id },
        data: {
          actualStart: now,
          status: 'IN_PROGRESS',
        },
      });
    } else {
      // Create a new ad-hoc shift
      shift = await prisma.shift.create({
        data: {
          userId: user.userId,
          actualStart: now,
          status: 'IN_PROGRESS',
        },
      });
    }

    // Create initial location ping
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
        action: 'CLOCK_IN',
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

    console.error('Clock in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
