import { NextResponse } from "next/server";
import { createServiceClient } from "@/services/supabase-server";
import { generateDischarge, getPromptVersion, getModelVersion } from "@/services/ai-provider";
import { apiError, ErrorCodes } from "@/lib/error-codes";

export async function POST(req: Request) {
  try {
    const patientInput = await req.json();
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const supabase = createServiceClient();
    const windowStart = new Date(Date.now() - 3600000).toISOString();
    const { count } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("identifier", ip)
      .eq("action_type", "demo_generate")
      .gte("created_at", windowStart);

    if (count && count >= 1) {
      return NextResponse.json(
        apiError(ErrorCodes.RATE_LIMITED),
        { status: 429 }
      );
    }

    const required = ["facilityName", "admissionDate", "dischargeDate", "patientName", "age", "gender", "hospitalNumber", "diagnosis", "treatmentGiven", "medications", "dischargedBy"];
    for (const field of required) {
      if (patientInput[field] === undefined || patientInput[field] === null || patientInput[field] === "") {
        return NextResponse.json(apiError(ErrorCodes.MISSING_REQUIRED_FIELD, { field }), { status: 400 });
      }
    }

    // Trigger AI generation
    const result = await generateDischarge(patientInput);

    // Save to database
    const patientId = crypto.randomUUID();
    const recordId = crypto.randomUUID();

    await supabase.from("patient_inputs").insert({
      patient_id: patientId,
      facility_name: patientInput.facilityName,
      admission_date: patientInput.admissionDate,
      discharge_date: patientInput.dischargeDate,
      patient_name: patientInput.patientName,
      age: patientInput.age,
      gender: patientInput.gender,
      hospital_number: patientInput.hospitalNumber,
      diagnosis: patientInput.diagnosis,
      treatment_given: patientInput.treatmentGiven,
      medications: JSON.stringify(patientInput.medications ?? []),
      discharged_by: patientInput.dischargedBy,
    }).throwOnError();

    await supabase.from("discharge_records").insert({
      record_id: recordId,
      patient_input_id: patientId,
      generated_at: new Date().toISOString(),
      generated_by_user_id: "demo-user",
      prompt_version: getPromptVersion(),
      model_version: getModelVersion(),
      clinical_summary: result.clinicalSummary,
      patient_friendly_output: result.patientFriendlyOutput,
      status: "draft",
    }).throwOnError();

    await supabase.from("rate_limits").insert({
      identifier: ip,
      action_type: "demo_generate",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      recordId,
      clinicalSummary: result.clinicalSummary,
      patientFriendlyOutput: result.patientFriendlyOutput,
    });
  } catch (err: unknown) {
    console.error("Demo generation error:", err);
    return NextResponse.json(
      apiError(ErrorCodes.GENERATION_FAILED),
      { status: 500 }
    );
  }
}
