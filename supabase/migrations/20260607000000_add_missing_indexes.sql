-- ============================================
-- Add missing indexes for multi-tenant queries
-- Audit finding: facility_id columns used in RLS
-- filtering but had no indexes, causing seq scans
-- ============================================

-- patient_inputs.facility_id — used in every patient list query
CREATE INDEX IF NOT EXISTS idx_patient_inputs_facility_id ON patient_inputs(facility_id);

-- discharge_records.facility_id — used in every record list query
CREATE INDEX IF NOT EXISTS idx_discharge_records_facility_id ON discharge_records(facility_id);

-- Composite index for dashboard list query (facility + status + date)
CREATE INDEX IF NOT EXISTS idx_discharge_records_facility_status_generated
  ON discharge_records(facility_id, status, generated_at DESC);

-- user_profiles.facility_id — used in admin clinician list and RLS
CREATE INDEX IF NOT EXISTS idx_user_profiles_facility_id ON user_profiles(facility_id);

-- audit_logs.ip_address — used for NDPR forensics investigations
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs(ip_address) WHERE ip_address IS NOT NULL;
