import { createServiceClient } from "./supabase-server";

export async function verifyFacilityAccess(
  recordId: string,
  userFacilityId?: string | null,
): Promise<{ allowed: boolean; facilityId?: string; error?: string }> {
  if (!userFacilityId) {
    return { allowed: false, error: "No facility assigned to your account." };
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("discharge_records")
    .select("facility_id")
    .eq("record_id", recordId)
    .single();

  if (error || !data) {
    return { allowed: false, error: "Record not found." };
  }

  if (data.facility_id !== userFacilityId) {
    return { allowed: false, error: "You do not have access to this record." };
  }

  return { allowed: true, facilityId: data.facility_id };
}
