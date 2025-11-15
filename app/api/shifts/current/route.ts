import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthRequest } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req: AuthRequest) => {
  try {
    const shift = await prisma.shift.findFirst({
      where: {
        userId: req.user!.userId,
        status: "IN_PROGRESS",
      },
      include: {
        locationPings: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    });

    if (!shift) {
      return NextResponse.json({ shift: null });
    }

    // Calculate duration
    const durationMs = shift.actualStart
      ? new Date().getTime() - shift.actualStart.getTime()
      : 0;
    const durationHours = durationMs / (1000 * 60 * 60);

    return NextResponse.json({
      shift: {
        id: shift.id,
        actualStart: shift.actualStart,
        status: shift.status,
        durationHours: durationHours.toFixed(2),
        locationPings: shift.locationPings,
      },
    });
  } catch (error) {
    console.error("Get current shift error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
