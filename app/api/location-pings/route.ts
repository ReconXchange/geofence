import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/auth/middleware';
import prisma from '@/lib/prisma';

const locationPingSchema = z.object({
  shiftId: z.string(),
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
    const { shiftId, latitude, longitude, accuracy } =
      locationPingSchema.parse(body);

    // Verify the shift belongs to the user and is active
    const shift = await prisma.shift.findFirst({
      where: {
        id: shiftId,
        userId: user.userId,
        status: 'IN_PROGRESS',
      },
    });

    if (!shift) {
      return NextResponse.json(
        { error: 'Invalid or inactive shift' },
        { status: 400 }
      );
    }

    // Create location ping
    const locationPing = await prisma.locationPing.create({
      data: {
        shiftId,
        latitude,
        longitude,
        accuracy,
      },
    });

    return NextResponse.json({
      success: true,
      locationPing,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Location ping error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
