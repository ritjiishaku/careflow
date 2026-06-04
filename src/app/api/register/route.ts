import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";
import { UserRole } from "@/types/schemas";
import { registerSchema } from "@/lib/validations";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== UserRole.Admin) {
      return NextResponse.json(apiError(ErrorCodes.ROLE_NOT_PERMITTED), { status: 403 });
    }

    const adminFacilityId = session.user.facilityId;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: "Server configuration error. Contact support." },
        { status: 500 },
      );
    }

    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 },
      );
    }

    const { email, password, fullName, role } = parsed.data;

    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError) {
      if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "An account could not be created. Please try again." },
        { status: 500 },
      );
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      email,
      full_name: fullName,
      role,
      facility_id: adminFacilityId ?? null,
    }, { onConflict: "user_id" });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId).catch(() => {});
      return NextResponse.json(
        { error: "Account could not be fully created. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
