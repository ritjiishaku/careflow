import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/types/schemas";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json(apiError(ErrorCodes.UNAUTHORIZED), { status: 401 });
    }

    if (session.user.role === UserRole.Admin) {
      return NextResponse.json(apiError(ErrorCodes.ROLE_NOT_PERMITTED), { status: 403 });
    }

    const supabase = createServiceClient();

    const facilityId = session.user.facilityId;
    const filter = facilityId ? (q: any) => q.eq("facility_id", facilityId) : (q: any) => q;

    const baseQuery = supabase.from("discharge_records");

    const [total, draft, finalised, archived] = await Promise.all([
      filter(baseQuery.select("*", { count: "estimated", head: true })).then((r: any) => r.count ?? 0),
      filter(baseQuery.select("*", { count: "estimated", head: true }).eq("status", "draft")).then((r: any) => r.count ?? 0),
      filter(baseQuery.select("*", { count: "estimated", head: true }).eq("status", "finalised")).then((r: any) => r.count ?? 0),
      filter(baseQuery.select("*", { count: "estimated", head: true }).eq("status", "archived")).then((r: any) => r.count ?? 0),
    ]);

    return NextResponse.json({
      success: true,
      data: { total, draft, finalised, archived },
    });
  } catch {
    return NextResponse.json(apiError(ErrorCodes.SUPABASE_ERROR), { status: 500 });
  }
}
