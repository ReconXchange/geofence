import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthRequest } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(async (req: AuthRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const shifts = await prisma.shift.findMany({
      where: {
        userId: req.user!.userId,
        status: {
          in: ["COMPLETED", "CANCELLED"],
        },
      },
      orderBy: {
        actualStart: "desc",
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        scheduledStart: true,
        scheduledEnd: true,
        actualStart: true,
        actualEnd: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate duration for each shift
    const shiftsWithDuration = shifts.map((shift) => {
      let durationHours = 0;
      if (shift.actualStart && shift.actualEnd) {
        const durationMs =
          shift.actualEnd.getTime() - shift.actualStart.getTime();
        durationHours = durationMs / (1000 * 60 * 60);
      }
      return {
        ...shift,
        durationHours: durationHours.toFixed(2),
      };
    });

    return NextResponse.json({ shifts: shiftsWithDuration });
  } catch (error) {
    console.error("Get shift history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
