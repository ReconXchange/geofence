import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthRequest } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const clockOutSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const POST = withAuth(async (req: AuthRequest) => {
  try {
    const body = await req.json();
    const { latitude, longitude } = clockOutSchema.parse(body);

    // Find active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: req.user!.userId,
        status: "IN_PROGRESS",
      },
      include: {
        locationPings: true,
      },
    });

    if (!activeShift) {
      return NextResponse.json(
        { error: "No active shift found" },
        { status: 400 }
      );
    }

    // Update shift
    const updateData: any = {
      actualEnd: new Date(),
      status: "COMPLETED",
    };

    // Add final location ping if provided
    if (latitude !== undefined && longitude !== undefined) {
      await prisma.locationPing.create({
        data: {
          shiftId: activeShift.id,
          latitude,
          longitude,
          timestamp: new Date(),
        },
      });
    }

    const shift = await prisma.shift.update({
      where: { id: activeShift.id },
      data: updateData,
    });

    // Calculate duration
    const durationMs =
      shift.actualEnd && shift.actualStart
        ? shift.actualEnd.getTime() - shift.actualStart.getTime()
        : 0;
    const durationHours = durationMs / (1000 * 60 * 60);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: req.user!.userId,
        action: "CLOCK_OUT",
        entityType: "SHIFT",
        entityId: shift.id,
        metadata: {
          durationHours,
          latitude,
          longitude,
        },
      },
    });

    return NextResponse.json({
      shift: {
        id: shift.id,
        actualStart: shift.actualStart,
        actualEnd: shift.actualEnd,
        status: shift.status,
        durationHours: durationHours.toFixed(2),
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Clock-out error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
