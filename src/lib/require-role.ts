import { ErrorCodes, apiError } from "@/lib/error-codes";
import type { UserRole } from "@/types/schemas";
import { NextResponse } from "next/server";

export function requireRole(
  userRole: string | undefined,
  allowedRoles: UserRole[],
  action: string,
): NextResponse | null {
  if (!userRole) {
    return NextResponse.json(
      apiError(ErrorCodes.UNAUTHORIZED),
      { status: 401 },
    );
  }

  if (!allowedRoles.includes(userRole as UserRole)) {
    return NextResponse.json(
      apiError(ErrorCodes.ROLE_NOT_PERMITTED, {
        role: userRole,
        action,
        requiredRole: allowedRoles.join(" or "),
      }),
      { status: 403 },
    );
  }

  return null;
}
