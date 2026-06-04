import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/types/schemas";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== UserRole.Admin) {
      return NextResponse.json(apiError(ErrorCodes.ROLE_NOT_PERMITTED), { status: 403 });
    }

    const facilityId = session.user.facilityId;
    if (!facilityId) {
      return NextResponse.json({
        success: true,
        data: { totalLogs: 0, actionCounts: {}, uniqueUsers: 0, recentActivity: [] },
      });
    }

    const supabase = createServiceClient();

    const [countRes, recentRes, usersRes] = await Promise.all([
      supabase.from("audit_logs").select("*", { count: "exact", head: true }).eq("facility_id", facilityId),
      supabase
        .from("audit_logs")
        .select("log_id, user_id, user_role, action, timestamp, ip_address, notes")
        .eq("facility_id", facilityId)
        .order("timestamp", { ascending: false })
        .limit(10),
      supabase.from("audit_logs").select("user_id").eq("facility_id", facilityId),
    ]);

    const totalLogs = countRes.count ?? 0;
    const recentList = (recentRes.data ?? []) as Record<string, unknown>[];
    const uniqueUsers = new Set((usersRes.data ?? []).map((r: Record<string, unknown>) => r.user_id as string));

    const recentUserIds = [...new Set(recentList.map((r) => r.user_id as string))];
    const { data: profiles } = recentUserIds.length > 0
      ? await supabase.from("user_profiles").select("user_id, full_name").in("user_id", recentUserIds)
      : { data: [] };
    const profileMap = new Map((profiles ?? []).map((p: Record<string, unknown>) => [p.user_id, p]));

    const recentActivity = recentList.map((r) => ({
      logId: r.log_id,
      userId: r.user_id,
      userRole: r.user_role,
      action: r.action,
      timestamp: r.timestamp,
      ipAddress: r.ip_address,
      notes: r.notes,
      userName: (profileMap.get(r.user_id as string) as Record<string, unknown> | undefined)?.full_name as string ?? r.user_id as string,
    }));

    const actionCounts: Record<string, number> = {};
    for (const row of recentList) {
      const a = row.action as string;
      actionCounts[a] = (actionCounts[a] ?? 0) + 1;
    }

    return NextResponse.json({
      success: true,
      data: { totalLogs, actionCounts, uniqueUsers: uniqueUsers.size, recentActivity },
    });
  } catch {
    return NextResponse.json(apiError(ErrorCodes.SUPABASE_ERROR), { status: 500 });
  }
}
