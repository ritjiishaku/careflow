import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/types/schemas";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session?.user?.role !== UserRole.Admin) {
      return NextResponse.json(apiError(ErrorCodes.ROLE_NOT_PERMITTED), { status: 403 });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("demo_requests")
      .select("id, full_name, role, facility_name, whatsapp_number, email, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch {
    return NextResponse.json(apiError(ErrorCodes.SUPABASE_ERROR, { operation: "SELECT demo_requests" }), { status: 500 });
  }
}
