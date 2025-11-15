import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./cookies";
import { verifyAccessToken } from "./jwt";

export interface AuthRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function withAuth(
  handler: (req: AuthRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const token = getAccessToken();

      if (!token) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }

      const payload = verifyAccessToken(token);
      (req as AuthRequest).user = payload;

      return handler(req as AuthRequest);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  };
}

export function withRole(allowedRoles: string[]) {
  return (
    handler: (req: AuthRequest) => Promise<NextResponse>
  ) => {
    return withAuth(async (req: AuthRequest) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }
      return handler(req);
    });
  };
}
