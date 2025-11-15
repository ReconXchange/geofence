import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withRole(["ADMIN", "MANAGER"])(async (req) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const userId = searchParams.get("userId");
    const format = searchParams.get("format") || "json"; // json or csv

    const where: any = {
      status: "COMPLETED",
    };

    if (userId) where.userId = userId;
    if (from) where.actualStart = { gte: new Date(from) };
    if (to) {
      where.actualEnd = where.actualEnd || {};
      where.actualEnd.lte = new Date(to);
    }

    const shifts = await prisma.shift.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        actualStart: "desc",
      },
    });

    // Calculate totals
    const totals = shifts.reduce(
      (acc, shift) => {
        if (shift.actualStart && shift.actualEnd) {
          const durationMs =
            shift.actualEnd.getTime() - shift.actualStart.getTime();
          const durationHours = durationMs / (1000 * 60 * 60);
          acc.totalHours += durationHours;
          acc.totalShifts += 1;
        }
        return acc;
      },
      { totalHours: 0, totalShifts: 0 }
    );

    if (format === "csv") {
      const csvHeader = "Date,Employee,Start,End,Duration (hours),Status\n";
      const csvRows = shifts.map((shift) => {
        const date = shift.actualStart
          ? new Date(shift.actualStart).toLocaleDateString()
          : "";
        const start = shift.actualStart
          ? new Date(shift.actualStart).toLocaleTimeString()
          : "";
        const end = shift.actualEnd
          ? new Date(shift.actualEnd).toLocaleTimeString()
          : "";
        let duration = "0";
        if (shift.actualStart && shift.actualEnd) {
          const durationMs =
            shift.actualEnd.getTime() - shift.actualStart.getTime();
          duration = (durationMs / (1000 * 60 * 60)).toFixed(2);
        }
        return `${date},"${shift.user.name}",${start},${end},${duration},${shift.status}`;
      });

      const csv = csvHeader + csvRows.join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="attendance-${from || "all"}-${to || "all"}.csv"`,
        },
      });
    }

    // JSON format
    const report = {
      from: from || null,
      to: to || null,
      totals: {
        totalShifts: totals.totalShifts,
        totalHours: totals.totalHours.toFixed(2),
      },
      shifts: shifts.map((shift) => {
        let durationHours = 0;
        if (shift.actualStart && shift.actualEnd) {
          const durationMs =
            shift.actualEnd.getTime() - shift.actualStart.getTime();
          durationHours = durationMs / (1000 * 60 * 60);
        }
        return {
          id: shift.id,
          date: shift.actualStart
            ? new Date(shift.actualStart).toISOString().split("T")[0]
            : null,
          employeeName: shift.user.name,
          employeeEmail: shift.user.email,
          start: shift.actualStart,
          end: shift.actualEnd,
          durationHours: durationHours.toFixed(2),
          status: shift.status,
        };
      }),
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Get attendance report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
