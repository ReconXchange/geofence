import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withRole(["ADMIN", "MANAGER"])(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const shift = await prisma.shift.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        locationPings: {
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!shift) {
      return NextResponse.json({ error: "Shift not found" }, { status: 404 });
    }

    return NextResponse.json({ shift });
  } catch (error) {
    console.error("Get shift error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
