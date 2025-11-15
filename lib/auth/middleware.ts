import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: JWTPayload | null; error: string | null }> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;

    if (!token) {
      return { user: null, error: 'No token provided' };
    }

    const user = verifyToken(token);
    if (!user) {
      return { user: null, error: 'Invalid or expired token' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

export function requireAuth(roles?: string[]) {
  return async (
    request: NextRequest,
    handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (roles && !roles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}
