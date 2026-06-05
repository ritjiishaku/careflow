import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { facilityRegisterSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();

    const body = await request.json();

    const parsed = facilityRegisterSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 },
      );
    }

    const { facilityName, facilityCode, adminName, adminEmail, adminPassword } = parsed.data;

    const recentCount = await supabase
      .from("facilities")
      .select("facility_id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 3600000).toISOString());

    if ((recentCount.count ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Too many facilities registered recently. Please try again later." },
        { status: 429 },
      );
    }

    const { data: facility, error: facilityError } = await supabase
      .from("facilities")
      .insert({ facility_name: facilityName, facility_code: facilityCode || null })
      .select("facility_id, facility_name, facility_code")
      .single();

    if (facilityError) {
      return NextResponse.json(
        { error: "Could not create facility. Please try again." },
        { status: 500 },
      );
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName },
    });

    if (authError) {
      await supabase.from("facilities").delete().eq("facility_id", facility.facility_id);
      return NextResponse.json(
        { error: authError.message },
        { status: 500 },
      );
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      email: adminEmail,
      full_name: adminName,
      role: "admin",
      facility_id: facility.facility_id,
    }, { onConflict: "user_id" });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId).catch(() => {});
      await supabase.from("facilities").delete().eq("facility_id", facility.facility_id);
      return NextResponse.json(
        { error: "Account could not be fully created. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      facility_id: facility.facility_id,
      facility_name: facility.facility_name,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
