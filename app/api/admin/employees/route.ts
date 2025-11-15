import { NextRequest, NextResponse } from "next/server";
import { withRole } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withRole(["ADMIN", "MANAGER"])(async (req) => {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: {
          in: ["EMPLOYEE", "MANAGER"],
        },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Get employees error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
});
