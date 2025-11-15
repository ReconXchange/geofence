import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthRequest } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const locationPingSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const POST = withAuth(async (req: AuthRequest) => {
  try {
    const body = await req.json();
    const { latitude, longitude } = locationPingSchema.parse(body);

    // Find active shift
    const activeShift = await prisma.shift.findFirst({
      where: {
        userId: req.user!.userId,
        status: "IN_PROGRESS",
      },
    });

    if (!activeShift) {
      return NextResponse.json(
        { error: "No active shift found" },
        { status: 400 }
      );
    }

    // Create location ping
    const ping = await prisma.locationPing.create({
      data: {
        shiftId: activeShift.id,
        latitude,
        longitude,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({ ping });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Location ping error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
