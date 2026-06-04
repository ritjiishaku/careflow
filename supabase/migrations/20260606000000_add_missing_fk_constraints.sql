-- ============================================
-- Add missing foreign key constraints
-- Audit finding: discharge_records and audit_logs
-- had user_id columns without FK references
-- ============================================

-- discharge_records.generated_by_user_id -> auth.users
ALTER TABLE discharge_records
  DROP CONSTRAINT IF EXISTS fk_discharge_records_generated_by,
  ADD CONSTRAINT fk_discharge_records_generated_by
    FOREIGN KEY (generated_by_user_id) REFERENCES auth.users(id) ON DELETE RESTRICT;

-- discharge_records.last_edited_by_user_id -> auth.users
ALTER TABLE discharge_records
  DROP CONSTRAINT IF EXISTS fk_discharge_records_last_edited_by,
  ADD CONSTRAINT fk_discharge_records_last_edited_by
    FOREIGN KEY (last_edited_by_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- audit_logs.user_id -> auth.users
ALTER TABLE audit_logs
  DROP CONSTRAINT IF EXISTS fk_audit_logs_user_id,
  ADD CONSTRAINT fk_audit_logs_user_id
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT;
