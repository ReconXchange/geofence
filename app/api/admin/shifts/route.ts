import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withRole(["ADMIN", "MANAGER"])(async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const shifts = await prisma.shift.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        locationPings: {
            take: 1,
            orderBy: { timestamp: "desc" },
          },
      },
      orderBy: {
        actualStart: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Calculate duration
    const shiftsWithDuration = shifts.map((shift) => {
      let durationHours = 0;
      if (shift.actualStart && shift.actualEnd) {
        const durationMs =
          shift.actualEnd.getTime() - shift.actualStart.getTime();
        durationHours = durationMs / (1000 * 60 * 60);
      } else if (shift.actualStart) {
        const durationMs = new Date().getTime() - shift.actualStart.getTime();
        durationHours = durationMs / (1000 * 60 * 60);
      }

      return {
        id: shift.id,
        userId: shift.userId,
        userName: shift.user.name,
        userEmail: shift.user.email,
        scheduledStart: shift.scheduledStart,
        scheduledEnd: shift.scheduledEnd,
        actualStart: shift.actualStart,
        actualEnd: shift.actualEnd,
        status: shift.status,
        durationHours: durationHours.toFixed(2),
        createdAt: shift.createdAt,
        lastLocation: shift.locationPings[0] || null,
      };
    });

    return NextResponse.json({ shifts: shiftsWithDuration });
  } catch (error) {
    console.error("Get shifts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
