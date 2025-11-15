import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withRole(["ADMIN", "MANAGER"])(async (req) => {
  try {
    const shifts = await prisma.shift.findMany({
      where: {
        status: "IN_PROGRESS",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        locationPings: {
          orderBy: { timestamp: "desc" },
          take: 1,
        },
      },
      orderBy: {
        actualStart: "desc",
      },
    });

    // Calculate duration for each shift
    const shiftsWithDuration = shifts.map((shift) => {
      const durationMs = shift.actualStart
        ? new Date().getTime() - shift.actualStart.getTime()
        : 0;
      const durationHours = durationMs / (1000 * 60 * 60);

      return {
        id: shift.id,
        userId: shift.userId,
        userName: shift.user.name,
        userEmail: shift.user.email,
        actualStart: shift.actualStart,
        durationHours: durationHours.toFixed(2),
        lastLocation: shift.locationPings[0] || null,
      };
    });

    return NextResponse.json({ shifts: shiftsWithDuration });
  } catch (error) {
    console.error("Get active shifts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
