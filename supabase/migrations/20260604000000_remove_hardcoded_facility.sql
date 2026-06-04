-- ============================================
-- Remove hardcoded default facility UUID
-- CFW-PRD-001: Multi-tenant signup requires
-- dynamic facility assignment via register APIs
-- ============================================

-- Update handle_new_user() to set facility_id = NULL
-- instead of the hardcoded LUTH UUID.
-- The register APIs (/api/register, /api/facilities/register)
-- assign the correct facility via upsert after profile creation.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, role, facility_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        'nurse',
        NULL
    );
    RETURN NEW;
END;
$$;
