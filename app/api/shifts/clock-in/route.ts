import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthRequest } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const clockInSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const POST = withAuth(async (req: AuthRequest) => {
  try {
    const body = await req.json();
    const { latitude, longitude } = clockInSchema.parse(body);

    // Check if user already has an active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: req.user!.userId,
        status: "IN_PROGRESS",
      },
    });

    if (activeShift) {
      return NextResponse.json(
        { error: "You already have an active shift" },
        { status: 400 }
      );
    }

    // Create new shift
    const shift = await prisma.shift.create({
      data: {
        userId: req.user!.userId,
        actualStart: new Date(),
        status: "IN_PROGRESS",
        locationPings: {
          create: {
            latitude,
            longitude,
            timestamp: new Date(),
          },
        },
      },
      include: {
        locationPings: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: "CLOCK_IN",
        entityType: "SHIFT",
        entityId: shift.id,
        metadata: {
          latitude,
          longitude,
        },
      },
    });

    return NextResponse.json({
      shift: {
        id: shift.id,
        actualStart: shift.actualStart,
        status: shift.status,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Clock-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
