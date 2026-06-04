-- ============================================
-- Add facility_id to audit_logs for NDPR
-- facility-scoped admin queries.
-- New logs get facility_id from the
-- create_discharge_record RPC function.
-- ============================================

ALTER TABLE audit_logs
  ADD COLUMN IF NOT EXISTS facility_id UUID REFERENCES facilities(facility_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_facility_id ON audit_logs(facility_id);

ALTER TABLE patient_inputs
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

ALTER TABLE discharge_records
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_patient_inputs_active ON patient_inputs(patient_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_discharge_records_active_full ON discharge_records(record_id) WHERE deleted_at IS NULL;
