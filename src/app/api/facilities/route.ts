import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("facilities")
      .select("facility_id, facility_name, facility_code")
      .order("facility_name");

    if (error) throw error;

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch {
    return NextResponse.json(apiError(ErrorCodes.SUPABASE_ERROR), { status: 500 });
  }
}
